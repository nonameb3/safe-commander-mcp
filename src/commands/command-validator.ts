import { sanitizeCommand } from '../security/sanitizer.js';
import { validatePath } from '../security/path-validator.js';
import { CONFIG } from '../config/config-loader.js';
import { log } from '../utils/logger.js';

/**
 * Enhanced command validation with length and security checks
 * Updated with secure error messages that don't leak configuration information
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
    // SECURITY: Updated error message to remove information leakage
    // Old (bad): `Command '${firstWord}' is not in the allowed commands list: [${CONFIG.ALLOWED_COMMANDS.join(', ')}]`
    // New (secure): No configuration disclosure
    throw new Error(`Command '${firstWord}' is not permitted. Use the 'list_available_commands' tool to see available options.`);
  }

  // Validate paths in command arguments for path-sensitive commands
  const args = sanitized.split(' ').slice(1); // Get arguments after the command
  const pathSensitiveCommands = ['cat', 'ls', 'node', 'npm', 'find', 'grep', 'head', 'tail'];
  
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
          // SECURITY: Don't reveal internal path structure in error messages
          throw new Error(`Invalid path argument in command. Path must be within the allowed working directory.`);
        }
      }
    }
  }
}

/**
 * Validate command without throwing (for testing/checking)
 * 
 * @param command - The command string to validate
 * @returns Object with validation result and error message if invalid
 */
export function isCommandValid(command: string): { valid: boolean; error?: string } {
  try {
    validateCommand(command);
    return { valid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    return { valid: false, error: errorMessage };
  }
}

/**
 * Get the base command (first word) from a command string
 * 
 * @param command - Full command string
 * @returns The base command name
 */
export function getBaseCommand(command: string): string {
  if (!command || typeof command !== 'string') {
    return '';
  }
  
  try {
    const sanitized = sanitizeCommand(command);
    return sanitized.split(' ')[0];
  } catch {
    return '';
  }
} 