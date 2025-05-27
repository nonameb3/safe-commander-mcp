// index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { exec } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Allowed commands
const ALLOWED_COMMANDS = process.env.ALLOWED_COMMANDS?.split(",") || ['npm', 'git', 'ls', 'cat', 'pwd', 'node'];
const ALLOWED_PATH = process.env.ALLOWED_PATH;

// Validate environment variables
if (!ALLOWED_PATH) {
  throw new Error("ALLOWED_PATH environment variable must be set");
}

// Validate path exists
if (!existsSync(ALLOWED_PATH)) {
  throw new Error(`ALLOWED_PATH directory does not exist: ${ALLOWED_PATH}`);
}

// Create the MCP server
const server = new Server({ name: "personal-dev-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

// Define your tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "run_command") {
    const command = args.command as string;

    // Security check
    const firstWord = command.split(" ")[0];
    if (!ALLOWED_COMMANDS.includes(firstWord)) {
      return {
        content: [{ type: "text", text: `Command '${firstWord}' not allowed` }],
      };
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: ALLOWED_PATH,
        timeout: 30000,
      });

      return {
        content: [
          {
            type: "text",
            text: `Command: ${command}\n\nOutput:\n${stdout}\n${stderr ? `Errors:\n${stderr}` : ""}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "run_command",
      description: "Execute allowed development commands",
      inputSchema: {
        type: "object",
        properties: {
          command: { type: "string", description: "Command to execute" },
        },
        required: ["command"],
      },
    },
  ],
}));

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
