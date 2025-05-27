import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { CommandRequest } from '../types/index.js';
import { executeCommand } from '../commands/command-executor.js';
import { getCommandDescription } from '../commands/command-registry.js';
import { CONFIG } from '../config/config-loader.js';

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

    throw new Error(`Unknown tool: ${name}`);
  });

  // Enhanced tool listing with configuration details
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "run_command",
        description: getCommandDescription(),
        inputSchema: {
          type: "object",
          properties: {
            command: { 
              type: "string", 
              description: `Command to execute (max ${CONFIG.MAX_COMMAND_LENGTH} characters). Must start with one of the allowed commands and cannot contain dangerous characters.`,
              maxLength: CONFIG.MAX_COMMAND_LENGTH
            },
          },
          required: ["command"],
        },
      },
    ],
  }));
} 