import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRequire } from "node:module";
import { validateCriticalConfig, loadConfig } from '../config/config-loader.js';
import { validateStartupConfiguration } from '../config/startup-validator.js';
import { setupGracefulShutdown } from '../utils/shutdown-handler.js';
import { setupRequestHandlers } from './request-handlers.js';
import { log } from '../utils/logger.js';

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json');

/**
 * Start the MCP server with full initialization
 * This is the main entry point for the server startup process
 */
export async function startMCPServer(): Promise<void> {
  try {
    // Initialize configuration and validation
    log('info', 'Initializing Safe Commander MCP server...');
    
    // Validate critical configuration first
    validateCriticalConfig();
    
    // Load configuration and setup shutdown handlers
    loadConfig();
    setupGracefulShutdown();
    
    // Run comprehensive startup validation
    validateStartupConfiguration();
    
    // Create the MCP server
    const server = new Server(
      { name: packageJson.name, version: packageJson.version },
      { capabilities: { tools: {} } }
    );
    
    // Setup request handlers
    setupRequestHandlers(server);
    
    // Start the server
    log('info', 'Starting MCP server...', {
      name: packageJson.name,
      version: packageJson.version,
      nodeVersion: process.version,
      platform: process.platform
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    log('info', 'MCP server started successfully and ready to accept requests');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown startup error';
    log('error', 'Failed to start MCP server', { error: errorMessage });
    throw error;
  }
} 