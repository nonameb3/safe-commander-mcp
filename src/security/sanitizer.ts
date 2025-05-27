/**
 * Security: Command injection prevention
 * 
 * @param command - The command string to sanitize
 * @returns The sanitized command string
 * @throws Error if command contains dangerous characters
 */
export function sanitizeCommand(command: string): string {
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