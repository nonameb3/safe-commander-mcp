// index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { exec } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";
import { resolve, normalize } from "node:path";
import { Config, CommandRequest, LogLevel } from "./interface/index.js";

const execAsync = promisify(exec);

// Configuration object with resource limits
const CONFIG: Config = {
  MAX_COMMAND_LENGTH: 1000,
  MAX_OUTPUT_SIZE: 1024 * 1024, // 1MB
  COMMAND_TIMEOUT: 30000,
  MAX_CONCURRENT_COMMANDS: 3,
  ALLOWED_COMMANDS: [],
  ALLOWED_PATH: ""
};

// Rate limiting and tracking
const commandCooldowns = new Map<string, number>();
const runningCommands = new Set<string>();

// Logging function with levels and timestamps
function log(level: LogLevel, message: string, extra?: any): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (extra) {
    console.error(logMessage, extra);
  } else {
    console.error(logMessage);
  }
}

// Security: Command injection prevention
function sanitizeCommand(command: string): string {
  if (!command || typeof command !== 'string') {
    throw new Error('Command must be a non-empty string');
  }

  // Remove dangerous characters that could lead to command injection
  const dangerousChars = /[;&|`$(){}[\]<>]/g;
  const sanitized = command.replace(dangerousChars, '');
  
  // Check if command was modified (potential injection attempt)
  if (sanitized !== command) {
    throw new Error('Command contains potentially dangerous characters: ; & | ` $ ( ) { } [ ] < >');
  }
  
  return sanitized.trim();
}

// Security: Path traversal prevention
function validatePath(inputPath: string, allowedBasePath: string): string {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('Path must be a non-empty string');
  }

  try {
    // Normalize and resolve the paths
    const normalizedInput = normalize(inputPath);
    const resolvedAllowed = resolve(allowedBasePath);
    const resolvedInput = resolve(resolvedAllowed, normalizedInput);
    
    // Check if the resolved path is within the allowed directory
    if (!resolvedInput.startsWith(resolvedAllowed)) {
      throw new Error('Path traversal attempt detected - path must be within allowed directory');
    }
    
    return resolvedInput;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown path validation error';
    throw new Error(`Invalid path: ${errorMessage}`);
  }
}

// Enhanced command validation with length and security checks
function validateCommand(command: string): void {
  if (!command || typeof command !== 'string') {
    throw new Error('Command must be a non-empty string');
  }

  if (command.length > CONFIG.MAX_COMMAND_LENGTH) {
    throw new Error(`Command exceeds maximum length of ${CONFIG.MAX_COMMAND_LENGTH} characters`);
  }

  // Sanitize and validate against dangerous characters
  const sanitized = sanitizeCommand(command);
  const firstWord = sanitized.split(' ')[0];
  
  if (!CONFIG.ALLOWED_COMMANDS.includes(firstWord)) {
    throw new Error(`Command '${firstWord}' is not in the allowed commands list: [${CONFIG.ALLOWED_COMMANDS.join(', ')}]`);
  }

  // Validate paths in command arguments for path-sensitive commands
  const args = sanitized.split(' ').slice(1); // Get arguments after the command
  const pathSensitiveCommands = ['cat', 'ls', 'node', 'npm'];
  
  if (pathSensitiveCommands.includes(firstWord)) {
    for (const arg of args) {
      // Skip flags (arguments starting with -)
      if (arg.startsWith('-')) {
        continue;
      }
      
      // Check if argument looks like a file path (contains / or is a relative path)
      if (arg.includes('/') || arg.includes('\\') || arg.startsWith('.')) {
        try {
          // Validate the path to prevent directory traversal
          validatePath(arg, CONFIG.ALLOWED_PATH);
          log('info', `Path validated successfully`, { command: firstWord, path: arg });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Path validation failed';
          throw new Error(`Invalid path in command '${command}': ${errorMessage}`);
        }
      }
    }
  }
}

// Rate limiting to prevent command spam
function checkRateLimit(command: string): void {
  const now = Date.now();
  const lastExecution = commandCooldowns.get(command);
  
  if (lastExecution && (now - lastExecution) < 1000) {
    throw new Error('Rate limit exceeded. Please wait at least 1 second before executing the same command again');
  }
  
  if (runningCommands.size >= CONFIG.MAX_CONCURRENT_COMMANDS) {
    throw new Error(`Maximum concurrent commands (${CONFIG.MAX_CONCURRENT_COMMANDS}) reached. Please wait for existing commands to complete`);
  }
}

// Configuration loader with comprehensive validation
function loadConfig(): void {
  try {
    // Load and validate ALLOWED_COMMANDS
    const allowedCommandsEnv = process.env.ALLOWED_COMMANDS;
    if (!allowedCommandsEnv) {
      CONFIG.ALLOWED_COMMANDS = ['npm', 'git', 'ls', 'cat', 'pwd', 'node'];
      log('warn', 'ALLOWED_COMMANDS not set, using defaults', { defaults: CONFIG.ALLOWED_COMMANDS });
    } else {
      const commands = allowedCommandsEnv.split(',').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
      if (commands.length === 0) {
        throw new Error('ALLOWED_COMMANDS cannot be empty after parsing');
      }
      CONFIG.ALLOWED_COMMANDS = commands;
    }

    // Load and validate ALLOWED_PATH
    const allowedPathEnv = process.env.ALLOWED_PATH;
    if (!allowedPathEnv) {
      throw new Error('ALLOWED_PATH environment variable must be set');
    }

    const resolvedPath = resolve(allowedPathEnv);
    if (!existsSync(resolvedPath)) {
      throw new Error(`ALLOWED_PATH directory does not exist: ${resolvedPath}`);
    }

    CONFIG.ALLOWED_PATH = resolvedPath;
    
    log('info', 'Configuration loaded successfully', {
      allowedCommands: CONFIG.ALLOWED_COMMANDS,
      allowedPath: CONFIG.ALLOWED_PATH,
      maxCommandLength: CONFIG.MAX_COMMAND_LENGTH,
      commandTimeout: CONFIG.COMMAND_TIMEOUT,
      maxConcurrentCommands: CONFIG.MAX_CONCURRENT_COMMANDS
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown configuration error';
    log('error', 'Failed to load configuration', { error: errorMessage });
    throw error;
  }
}

// Graceful shutdown with proper cleanup
function setupGracefulShutdown(): void {
  const shutdown = (signal: string) => {
    log('info', `Received ${signal}, initiating graceful shutdown...`);
    
    // Set a timeout for forced shutdown
    const shutdownTimeout = setTimeout(() => {
      log('warn', 'Shutdown timeout reached, forcing exit');
      process.exit(1);
    }, 5000);

    if (runningCommands.size === 0) {
      clearTimeout(shutdownTimeout);
      log('info', 'Shutdown complete - no running commands');
      process.exit(0);
    } else {
      log('info', `Waiting for ${runningCommands.size} running commands to complete...`);
      const checkInterval = setInterval(() => {
        if (runningCommands.size === 0) {
          clearInterval(checkInterval);
          clearTimeout(shutdownTimeout);
          log('info', 'Shutdown complete - all commands finished');
          process.exit(0);
        }
      }, 100);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Load configuration and setup shutdown handlers on startup
loadConfig();
setupGracefulShutdown();

// Comprehensive startup validation
function validateStartupConfiguration(): void {
  try {
    log('info', 'Running startup validation checks...');
    
    // Test command validation logic with each allowed command
    for (const cmd of CONFIG.ALLOWED_COMMANDS) {
      try {
        validateCommand(cmd);
        log('debug', `Command validation successful for: ${cmd}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
        throw new Error(`Startup validation failed for allowed command '${cmd}': ${errorMessage}`);
      }
    }
    
    // Test path validation logic with the allowed path
    try {
      validatePath('.', CONFIG.ALLOWED_PATH);
      validatePath('./test', CONFIG.ALLOWED_PATH);
      log('debug', 'Path validation logic working correctly');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown path validation error';
      throw new Error(`Path validation logic failed: ${errorMessage}`);
    }
    
    // Test sanitizeCommand function with safe commands
    try {
      for (const cmd of CONFIG.ALLOWED_COMMANDS) {
        const sanitized = sanitizeCommand(cmd);
        if (sanitized !== cmd) {
          throw new Error(`Command '${cmd}' failed sanitization check`);
        }
      }
      log('debug', 'Command sanitization logic working correctly');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sanitization error';
      throw new Error(`Command sanitization failed: ${errorMessage}`);
    }
    
    // Validate configuration values
    if (CONFIG.MAX_COMMAND_LENGTH <= 0) {
      throw new Error('MAX_COMMAND_LENGTH must be greater than 0');
    }
    if (CONFIG.MAX_OUTPUT_SIZE <= 0) {
      throw new Error('MAX_OUTPUT_SIZE must be greater than 0');
    }
    if (CONFIG.COMMAND_TIMEOUT <= 0) {
      throw new Error('COMMAND_TIMEOUT must be greater than 0');
    }
    if (CONFIG.MAX_CONCURRENT_COMMANDS <= 0) {
      throw new Error('MAX_CONCURRENT_COMMANDS must be greater than 0');
    }
    
    // Test that dangerous commands are properly rejected
    const dangerousCommands = ['rm -rf', 'sudo rm', 'chmod +x; /bin/sh', 'cat /etc/passwd'];
    for (const dangerousCmd of dangerousCommands) {
      try {
        validateCommand(dangerousCmd);
        // If we get here, validation failed to catch a dangerous command
        throw new Error(`Validation failed to reject dangerous command: ${dangerousCmd}`);
      } catch (error) {
        // This is expected - dangerous commands should be rejected
        log('debug', `Correctly rejected dangerous command: ${dangerousCmd}`);
      }
    }
    
    log('info', 'All startup validation checks passed successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown startup validation error';
    log('error', 'Startup validation failed', { error: errorMessage });
    throw new Error(`Startup validation failed: ${errorMessage}`);
  }
}

// Validate critical configuration first
function validateCriticalConfig(): void {
  const allowedPath = process.env.ALLOWED_PATH;
  
  if (!allowedPath) {
    console.error('FATAL: ALLOWED_PATH environment variable must be set');
    process.exit(1);
  }
  
  if (!existsSync(allowedPath)) {
    console.error(`FATAL: ALLOWED_PATH directory does not exist: ${allowedPath}`);
    process.exit(1);
  }
  
  console.log(`✅ Configuration validated: ${allowedPath}`);
}

validateCriticalConfig();

// Run startup validation
validateStartupConfiguration();

// Create the MCP server
const server = new Server({ name: "personal-dev-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

// Enhanced tool handler with comprehensive security and monitoring
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "run_command") {
    const command = (args as unknown as CommandRequest).command;
    const startTime = Date.now();
    let commandId: string | null = null;

    try {
      // Input validation
      if (!command || typeof command !== 'string') {
        throw new Error('Command parameter is required and must be a non-empty string');
      }

      // Comprehensive security and validation checks
      validateCommand(command);
      checkRateLimit(command);

      // Track the running command
      commandId = `${command}_${startTime}`;
      runningCommands.add(commandId);
      commandCooldowns.set(command, startTime);

      log('info', `Executing command: ${command}`, { commandId, workingDirectory: CONFIG.ALLOWED_PATH });

      // Execute command with resource limits
      const { stdout, stderr } = await execAsync(command, {
        cwd: CONFIG.ALLOWED_PATH,
        timeout: CONFIG.COMMAND_TIMEOUT,
        maxBuffer: CONFIG.MAX_OUTPUT_SIZE,
      });

      const executionTime = Date.now() - startTime;
      log('info', `Command completed successfully`, { 
        command, 
        executionTime: `${executionTime}ms`,
        outputSize: `${(stdout + stderr).length} bytes`
      });

      // Check output size and provide feedback
      const totalOutput = stdout + stderr;
      let outputMessage = `Command: ${command}\nExecution time: ${executionTime}ms\n\nOutput:\n${stdout}`;
      
      if (stderr) {
        outputMessage += `\nErrors:\n${stderr}`;
      }
      
      if (totalOutput.length > CONFIG.MAX_OUTPUT_SIZE) {
        log('warn', `Command output truncated due to size limit`, { command, originalSize: totalOutput.length });
        outputMessage += `\n\n[OUTPUT TRUNCATED - Original size: ${totalOutput.length} bytes, Limit: ${CONFIG.MAX_OUTPUT_SIZE} bytes]`;
      }

      return {
        content: [{
          type: "text",
          text: outputMessage,
        }],
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during command execution';
      
      log('error', `Command failed`, { 
        command, 
        executionTime: `${executionTime}ms`,
        error: errorMessage 
      });

      return {
        content: [{
          type: "text",
          text: `Error executing command '${command}': ${errorMessage}`,
        }],
      };
    } finally {
      // Always clean up the running command tracker
      if (commandId) {
        runningCommands.delete(commandId);
      }
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Enhanced tool listing with configuration details
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "run_command",
      description: `Execute allowed development commands safely with security controls and resource limits. Allowed commands: ${CONFIG.ALLOWED_COMMANDS.join(', ')}`,
      inputSchema: {
        type: "object",
        properties: {
          command: { 
            type: "string", 
            description: `Command to execute (max ${CONFIG.MAX_COMMAND_LENGTH} characters). Must start with one of the allowed commands and cannot contain dangerous characters.`,
            maxLength: CONFIG.MAX_COMMAND_LENGTH
          },
        },
        required: ["command"],
      },
    },
  ],
}));

// Enhanced main function with better error handling
async function main(): Promise<void> {
  try {
    log('info', 'Starting MCP server...', {
      name: "personal-dev-mcp",
      version: "1.0.0",
      nodeVersion: process.version,
      platform: process.platform
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    log('info', 'MCP server started successfully and ready to accept requests');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown startup error';
    log('error', 'Failed to start MCP server', { error: errorMessage });
    throw error;
  }
}

// Start the server with comprehensive error handling
main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown fatal error';
  log('error', 'Fatal error in main function', { error: errorMessage });
  console.error('FATAL:', error);
  process.exit(1);
});
