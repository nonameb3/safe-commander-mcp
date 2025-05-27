/**
 * TypeScript interfaces and types for the Safe Commander MCP server
 */

/** Request interface for command execution */
export interface CommandRequest {
  command: string;
}

/** Configuration interface for server settings */
export interface Config {
  MAX_COMMAND_LENGTH: number;
  MAX_OUTPUT_SIZE: number; // 1MB in bytes
  COMMAND_TIMEOUT: number;
  MAX_CONCURRENT_COMMANDS: number;
  ALLOWED_COMMANDS: string[];
  ALLOWED_PATH: string;
}

/** Log level types for the logging system */
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/** Command execution result interface */
export interface CommandResult {
  success: boolean;
  output: string;
  stderr?: string;
  executionTime: number;
  command: string;
}

/** Security validation result interface */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/** Rate limiting information interface */
export interface RateLimitInfo {
  commandId: string;
  lastExecution: number;
  isBlocked: boolean;
} 