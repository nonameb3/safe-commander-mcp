import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { CommandRequest } from '../types/index.js';
import { executeCommand } from '../commands/command-executor.js';
import { categorizeCommands, getCommandDescriptions, getCommandSummary, validateCommandCategories } from '../commands/command-categorizer.js';
import { CONFIG } from '../config/config-loader.js';
import { log } from '../utils/logger.js';

/**
 * Setup MCP tool request handlers
 * 
 * @param server - The MCP server instance to configure
 */
export function setupRequestHandlers(server: Server): void {
  // Enhanced tool handler with comprehensive security and monitoring
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "run_command") {
      const commandRequest = args as unknown as CommandRequest;
      const result = await executeCommand(commandRequest);
      
      return {
        content: [{
          type: "text",
          text: result.output,
        }],
      };
    }

    if (name === "list_available_commands") {
      try {
        // Get categorized commands and descriptions
        const categorized = categorizeCommands(CONFIG.ALLOWED_COMMANDS);
        const descriptions = getCommandDescriptions(CONFIG.ALLOWED_COMMANDS);
        const summary = getCommandSummary(CONFIG.ALLOWED_COMMANDS);
        
        // Get validation info for debugging (only log if there are issues)
        const validation = validateCommandCategories(CONFIG.ALLOWED_COMMANDS);
        if (!validation.valid) {
          log('debug', 'Command categorization validation', {
            missingCategories: validation.missingCategories,
            missingDescriptions: validation.missingDescriptions
          });
        }

        // Build comprehensive response
        const response = {
          workingDirectory: CONFIG.ALLOWED_PATH,
          totalCommands: CONFIG.ALLOWED_COMMANDS.length,
          categories: categorized,
          commandDescriptions: descriptions,
          summary: {
            topCategories: summary.topCategories.slice(0, 5), // Top 5 categories
            categoryCounts: summary.categoryCounts
          },
          configuration: {
            maxCommandLength: CONFIG.MAX_COMMAND_LENGTH,
            commandTimeout: `${CONFIG.COMMAND_TIMEOUT}ms`,
            maxConcurrentCommands: CONFIG.MAX_CONCURRENT_COMMANDS,
            maxOutputSize: `${Math.round(CONFIG.MAX_OUTPUT_SIZE / 1024)}KB`
          }
        };

        log('info', 'Command list requested', { 
          totalCommands: CONFIG.ALLOWED_COMMANDS.length,
          requestedBy: 'Claude'
        });

        return {
          content: [{
            type: "text",
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log('error', 'Failed to list available commands', { error: errorMessage });
        
        return {
          content: [{
            type: "text",
            text: `Error retrieving command list: ${errorMessage}`
          }]
        };
      }
    }

    throw new Error(`Unknown tool: ${name}`);
  });

  // Enhanced tool listing with better descriptions and command enumeration
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "run_command",
        description: "Execute secure development commands with comprehensive validation and monitoring. Commands are categorized by type (package management, version control, file operations, etc.) and executed within a controlled environment.",
        inputSchema: {
          type: "object",
          properties: {
            command: { 
              type: "string",
              description: `Command to execute from the available command set. Must be one of the allowed commands and cannot contain dangerous characters. Use 'list_available_commands' to see all available options.`,
              enum: CONFIG.ALLOWED_COMMANDS, // CRITICAL: This enables Claude's intelligence
              maxLength: CONFIG.MAX_COMMAND_LENGTH
            },
          },
          required: ["command"],
        },
      },
      {
        name: "list_available_commands",
        description: "Get comprehensive information about all available commands including categories, descriptions, working directory, and system configuration. This helps understand what operations are possible before attempting to execute commands.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        },
      },
    ],
  }));
} 