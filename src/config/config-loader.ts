import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Config } from '../types/index';
import { log } from '../utils/logger';

// Configuration object with resource limits
export const CONFIG: Config = {
  MAX_COMMAND_LENGTH: 1000,
  MAX_OUTPUT_SIZE: 1024 * 1024, // 1MB
  COMMAND_TIMEOUT: 30000,
  MAX_CONCURRENT_COMMANDS: 3,
  ALLOWED_COMMANDS: [],
  ALLOWED_PATH: ""
};

/**
 * Configuration loader with comprehensive validation
 * 
 * @throws Error if configuration is invalid
 */
export function loadConfig(): void {
  try {
    // Load and validate ALLOWED_COMMANDS
    const allowedCommandsEnv = process.env.ALLOWED_COMMANDS;
    if (!allowedCommandsEnv) {
      CONFIG.ALLOWED_COMMANDS = ['ls', 'cat', 'pwd', 'echo'];
      log('warn', 'ALLOWED_COMMANDS not set, using security-first defaults', { 
        defaults: CONFIG.ALLOWED_COMMANDS,
        securityNote: 'Only read-only commands included by default. Add other commands only if you understand the risks.'
      });
    } else {
      const commands = allowedCommandsEnv.split(',').map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
      if (commands.length === 0) {
        throw new Error('ALLOWED_COMMANDS cannot be empty after parsing');
      }
      CONFIG.ALLOWED_COMMANDS = commands;
      
      // Security warning for dangerous commands
      const dangerousCommands = commands.filter(cmd => ['node', 'python', 'python3', 'bash', 'sh', 'zsh', 'npm', 'curl', 'wget'].includes(cmd));
      if (dangerousCommands.length > 0) {
        log('warn', 'SECURITY WARNING: Commands with elevated risk detected', {
          dangerousCommands,
          warning: 'These commands may allow LLMs to access sensitive data or execute arbitrary code. Ensure you trust the LLM and understand the implications.'
        });
      }
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

/**
 * Validate critical configuration first
 * 
 * @throws Process exits with code 1 if critical config is invalid
 */
export function validateCriticalConfig(): void {
  const allowedPath = process.env.ALLOWED_PATH;
  
  if (!allowedPath) {
    log('error', 'FATAL: ALLOWED_PATH environment variable must be set');
    process.exit(1);
  }
  
  if (!existsSync(allowedPath)) {
    log('error', `FATAL: ALLOWED_PATH directory does not exist: ${allowedPath}`);
    process.exit(1);
  }
  
  log('info', 'Configuration validated successfully', { allowedPath });
} 