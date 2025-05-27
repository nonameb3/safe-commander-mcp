// TypeScript interfaces for proper typing
export interface CommandRequest {
  command: string;
}

export interface Config {
  MAX_COMMAND_LENGTH: number;
  MAX_OUTPUT_SIZE: number; // 1MB in bytes
  COMMAND_TIMEOUT: number;
  MAX_CONCURRENT_COMMANDS: number;
  ALLOWED_COMMANDS: string[];
  ALLOWED_PATH: string;
}

export type LogLevel = 'info' | 'warn' | 'error';
