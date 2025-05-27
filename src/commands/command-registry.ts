import { CONFIG } from '../config/config-loader.js';

/**
 * Command categories for better organization and discovery
 */
export const COMMAND_CATEGORIES = {
  PACKAGE_MANAGERS: ['npm', 'yarn', 'pnpm'],
  VERSION_CONTROL: ['git'],
  FILE_OPERATIONS: ['ls', 'cat', 'pwd'],
  RUNTIME: ['node', 'python', 'python3'],
  BUILD_TOOLS: ['make', 'cmake', 'tsc'],
  DEVELOPMENT: ['curl', 'wget', 'grep', 'find']
} as const;

/**
 * Get all allowed commands from configuration
 * 
 * @returns Array of allowed command names
 */
export function getAllowedCommands(): string[] {
  return [...CONFIG.ALLOWED_COMMANDS];
}

/**
 * Get commands by category
 * 
 * @param category - The category to filter by
 * @returns Array of commands in the specified category that are also allowed
 */
export function getCommandsByCategory(category: keyof typeof COMMAND_CATEGORIES): string[] {
  const categoryCommands = COMMAND_CATEGORIES[category];
  return categoryCommands.filter(cmd => CONFIG.ALLOWED_COMMANDS.includes(cmd));
}

/**
 * Get the category of a command
 * 
 * @param command - The command to categorize
 * @returns The category name or 'OTHER' if not found
 */
export function getCommandCategory(command: string): string {
  for (const [category, commands] of Object.entries(COMMAND_CATEGORIES)) {
    if ((commands as readonly string[]).includes(command)) {
      return category;
    }
  }
  return 'OTHER';
}

/**
 * Check if a command is allowed
 * 
 * @param command - The command to check
 * @returns True if the command is in the allowed list
 */
export function isCommandAllowed(command: string): boolean {
  return CONFIG.ALLOWED_COMMANDS.includes(command);
}

/**
 * Get command description for the MCP tool listing
 * 
 * @returns Description string for the run_command tool
 */
export function getCommandDescription(): string {
  return `Execute allowed development commands safely with security controls and resource limits. Allowed commands: ${CONFIG.ALLOWED_COMMANDS.join(', ')}`;
} 