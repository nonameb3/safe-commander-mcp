#!/usr/bin/env node

import { startMCPServer } from './server/mcp-server';

/**
 * Main entry point for the Safe Commander MCP server
 * Minimal bootstrap that delegates to the server startup logic
 */
async function main(): Promise<void> {
  try {
    await startMCPServer();
  } catch (error) {
    console.error('FATAL:', error);
    process.exit(1);
  }
}

// Start the server with comprehensive error handling
main().catch((error) => {
  console.error('FATAL:', error);
  process.exit(1);
}); 