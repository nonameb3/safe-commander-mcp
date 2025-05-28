import type { LogLevel } from '../types/index';

/**
 * Logging function with levels and timestamps
 * IMPORTANT: Use log() function instead of console.log() because MCP servers use stdio transport
 * where stdout is reserved for JSON-RPC messages and stderr is for logging
 */
export function log(level: LogLevel, message: string, extra?: any): void {
  // Suppress logging during tests to reduce noise
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (extra) {
    console.error(logMessage, extra);
  } else {
    console.error(logMessage);
  }
} 