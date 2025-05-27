/**
 * Rate limiting and tracking for command execution
 */

// Rate limiting and tracking storage
const commandCooldowns = new Map<string, number>();
const runningCommands = new Set<string>();

/**
 * Rate limiting to prevent command spam
 * 
 * @param command - The command to check rate limiting for
 * @param maxConcurrentCommands - Maximum number of concurrent commands allowed
 * @throws Error if rate limit is exceeded or too many concurrent commands
 */
export function checkRateLimit(command: string, maxConcurrentCommands: number): void {
  const now = Date.now();
  const lastExecution = commandCooldowns.get(command);
  
  if (lastExecution && (now - lastExecution) < 1000) {
    throw new Error('Rate limit exceeded. Please wait at least 1 second before executing the same command again');
  }
  
  if (runningCommands.size >= maxConcurrentCommands) {
    throw new Error(`Maximum concurrent commands (${maxConcurrentCommands}) reached. Please wait for existing commands to complete`);
  }
}

/**
 * Track the start of a command execution
 * 
 * @param commandId - Unique identifier for the command
 * @param command - The command being executed
 */
export function trackCommandStart(commandId: string, command: string): void {
  runningCommands.add(commandId);
  commandCooldowns.set(command, Date.now());
}

/**
 * Track the end of a command execution
 * 
 * @param commandId - Unique identifier for the command
 */
export function trackCommandEnd(commandId: string): void {
  runningCommands.delete(commandId);
}

/**
 * Get the current number of running commands
 * 
 * @returns Number of currently running commands
 */
export function getRunningCommandsCount(): number {
  return runningCommands.size;
}

/**
 * Get the set of running command IDs (for shutdown handling)
 * 
 * @returns Set of running command IDs
 */
export function getRunningCommands(): Set<string> {
  return new Set(runningCommands);
} 