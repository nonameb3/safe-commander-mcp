import { sanitizeCommand } from '../security/sanitizer.js';
import { validatePath } from '../security/path-validator.js';
import { CONFIG } from '../config/config-loader.js';
import { log } from '../utils/logger.js';

/**
 * Enhanced command validation with length and security checks
 * 
 * @param command - The command string to validate
 * @throws Error if command is invalid or fails security checks
 */
export function validateCommand(command: string): void {
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