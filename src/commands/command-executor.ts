import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { CommandRequest, CommandResult } from '../types/index.js';
import { validateCommand } from './command-validator.js';
import { checkRateLimit, trackCommandStart, trackCommandEnd } from '../security/rate-limiter.js';
import { CONFIG } from '../config/config-loader.js';
import { log } from '../utils/logger.js';

const execAsync = promisify(exec);

/**
 * Execute a command with comprehensive security and monitoring
 * 
 * @param request - The command request containing the command to execute
 * @returns Promise resolving to command execution result
 */
export async function executeCommand(request: CommandRequest): Promise<CommandResult> {
  const { command } = request;
  const startTime = Date.now();
  let commandId: string | null = null;

  try {
    // Input validation
    if (!command || typeof command !== 'string') {
      throw new Error('Command parameter is required and must be a non-empty string');
    }

    // Comprehensive security and validation checks
    validateCommand(command);
    checkRateLimit(command, CONFIG.MAX_CONCURRENT_COMMANDS);

    // Track the running command
    commandId = `${command}_${startTime}`;
    trackCommandStart(commandId, command);

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
      success: true,
      output: outputMessage,
      stderr,
      executionTime,
      command
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
      success: false,
      output: `Error executing command '${command}': ${errorMessage}`,
      executionTime,
      command
    };
  } finally {
    // Always clean up the running command tracker
    if (commandId) {
      trackCommandEnd(commandId);
    }
  }
} 