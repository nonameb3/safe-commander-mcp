# Safe Commander MCP

[![npm version](https://badge.fury.io/js/safe-commander-mcp.svg)](https://badge.fury.io/js/safe-commander-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)

A secure MCP (Model Context Protocol) server for executing whitelisted development commands with comprehensive security controls and resource limits. Features revolutionary **intelligent command discovery** that transforms AI assistance from "trial and error" to proactive, categorized command suggestions. Perfect for AI assistants that need safe command execution capabilities.

## Features

🧠 **Intelligent Command Discovery**
- Revolutionary `list_available_commands` tool for proactive assistance
- Command categorization by type (package management, version control, file operations, etc.)
- Comprehensive command descriptions and real-time configuration reporting
- Transform from "trial and error" to intelligent command workflows

🔒 **Security First**
- Command whitelisting with configurable allowed commands
- Path traversal prevention and directory restrictions  
- Command injection protection with character sanitization
- Resource limits (timeout, output size, concurrent commands)
- Startup validation to catch configuration issues early

⚡ **Performance & Monitoring**
- Execution time tracking and detailed logging
- Rate limiting with command cooldowns (1-second minimum between same commands)
- Concurrent command management (configurable limit)
- Graceful shutdown handling with cleanup

🛠️ **Developer Friendly**
- TypeScript implementation with full type safety
- Comprehensive error messages and debugging logs
- Environment-based configuration
- Production-ready logging to stderr (MCP-compliant)

## Quick Start (No Installation Required!)

**🚀 You can use Safe Commander MCP without installing it globally on your machine!**

Just add this configuration to your MCP client and you're ready to go:

```json
{
  "mcpServers": {
    "safe-commander": {
      "command": "npx",
      "args": ["-y", "safe-commander-mcp"],
      "env": {
        "ALLOWED_PATH": "/path/to/your/project",
        "ALLOWED_COMMANDS": "npm,git,ls,cat,pwd,node"
      }
    }
  }
}
```

That's it! The `npx -y` command will automatically download and run the latest version when needed.

## Configuration

### Required Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ALLOWED_PATH` | ✅ **Yes** | `/Users/yourname/projects/my-app` | Directory where commands can be executed (use absolute path) |
| `ALLOWED_COMMANDS` | No | `npm,git,ls,cat,pwd,node,python` | Comma-separated list of allowed commands |

### Claude Desktop Setup

**Step 1:** Open your Claude Desktop config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

**Step 2:** Add the Safe Commander MCP configuration:

```json
{
  "mcpServers": {
    "safe-commander": {
      "command": "npx",
      "args": ["-y", "safe-commander-mcp"],
      "env": {
        "ALLOWED_PATH": "/Users/yourname/projects/my-project",
        "ALLOWED_COMMANDS": "npm,yarn,git,ls,cat,pwd,node,python,pip"
      }
    }
  }
}
```

**Step 3:** Replace `/Users/yourname/projects/my-project` with your actual project path.

**Step 4:** Restart Claude Desktop.

**Step 5:** Test by asking: *"What commands are available?"*

### Other MCP Clients

For other MCP clients, use the same configuration format. The key points:
- **Command**: `npx`
- **Args**: `["-y", "safe-commander-mcp"]`
- **Environment**: Set `ALLOWED_PATH` and optionally `ALLOWED_COMMANDS`

## Real-World Examples

### For Web Development
```json
"ALLOWED_PATH": "/Users/yourname/projects/my-web-app"
"ALLOWED_COMMANDS": "npm,yarn,git,ls,cat,pwd,node,npx"
```

### For Python Development
```json
"ALLOWED_PATH": "/Users/yourname/projects/my-python-app"
"ALLOWED_COMMANDS": "python,pip,git,ls,cat,pwd,python3,poetry"
```

**⚠️ Security Note**: `ALLOWED_COMMANDS` can be customized to include any commands you need, but **carefully review each command** before adding it. More powerful commands enable more capable LLM assistance, but also introduce greater security risks. Always follow the principle of least privilege - only allow commands that are actually needed for your project.

### For Full-Stack Development
```json
"ALLOWED_PATH": "/Users/yourname/projects"
"ALLOWED_COMMANDS": "npm,yarn,python,pip,git,ls,cat,pwd,node,docker,make,curl"
```

**🔒 Security Reminder**: This example includes powerful commands like `docker`, `make`, and `curl`. Only include commands you actually need and understand. Each additional command expands the potential attack surface.

Use these environment variable values in the main MCP configuration shown in the [Claude Desktop Setup](#claude-desktop-setup) section above.

## Alternative Installation Methods

### If You Prefer Global Installation

If you want to install globally first (optional):

```bash
npm install -g safe-commander-mcp
```

Then use `"command": "safe-commander-mcp"` instead of the npx approach in your MCP configuration.

### For Development/Contributing

If you want to contribute to Safe Commander MCP or develop new features:

```bash
# Clone the repository
git clone https://github.com/nonameb3/safe-commander-mcp.git
cd safe-commander-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode (with file watching)
npm run dev

# Run tests
npm test

# Check TypeScript types
npm run lint
```

This setup allows you to modify the source code and test changes locally before contributing back to the project.

## Usage Examples

### Intelligent Command Discovery (NEW!)

Claude can now proactively discover and suggest commands without guessing:

```
"What commands are available in this project?"
"Show me the available package management commands"
"List all development tools I can use here"
"What are my options for version control operations?"
```

The `list_available_commands` tool provides:
- **Command Categories**: Organized by type (package management, version control, file operations, etc.)
- **Detailed Descriptions**: Explanation of what each command does
- **Configuration Info**: Current working directory, resource limits, and timeouts
- **Usage Statistics**: Command counts and category summaries

### Basic Command Execution

Once configured, you can ask your AI assistant to run commands:

```
"Run npm install in the project directory"
"Show me the git status"
"List the files in the current directory"
"Run the build script with npm run build"
```

### Safe Commands

The following commands are safe by default:
- `npm` - Package management and script execution
- `git` - Version control operations
- `ls` - Directory listing
- `cat` - File content reading
- `pwd` - Current directory
- `node` - Node.js script execution

### Custom Command Configuration

You can customize allowed commands for your specific needs, but always review each command carefully:

```json
{
  "env": {
    "ALLOWED_PATH": "/path/to/project",
    "ALLOWED_COMMANDS": "npm,yarn,pnpm,git,ls,cat,pwd,node,python,pip,poetry"
  }
}
```

**🛡️ Security Guidelines for Command Selection:**
- **Start minimal**: Begin with only the commands you know you need
- **Add incrementally**: Add new commands only when required for specific tasks
- **Review regularly**: Periodically audit your command list and remove unused commands
- **Understand risks**: Research what each command can do before adding it
- **Principle of least privilege**: More powerful LLMs with more commands = greater capabilities but also greater risks

**Common command categories and their risk levels:**
- **Low risk**: `ls`, `cat`, `pwd`, `echo` - Read-only file operations
- **Medium risk**: `npm`, `git`, `node` - Development tools with limited system access
- **High risk**: `curl`, `wget`, `docker`, `sudo` - Network access or system-level operations

## Security Features

### Command Validation
- **Whitelist-only**: Only pre-approved commands can be executed
- **Character sanitization**: Dangerous characters (`; & | \` $ ( ) { } [ ] < >`) are blocked
- **Path validation**: Prevents directory traversal attacks
- **Length limits**: Commands are limited to 1000 characters

### Resource Limits
- **Execution timeout**: 30 seconds maximum per command
- **Output size limit**: 1MB maximum output
- **Concurrent commands**: Maximum 3 simultaneous executions
- **Rate limiting**: 1-second cooldown between identical commands

### Directory Restrictions
All commands are executed within the configured `ALLOWED_PATH` directory, preventing access to sensitive system areas.

## API Reference

### Available Tools

#### `list_available_commands` (NEW!)

Discover available commands with intelligent categorization and descriptions.

**Parameters:**
- None required

**Response:**
- **Working Directory**: Current `ALLOWED_PATH` configuration
- **Command Categories**: Commands organized by type (package management, version control, file operations, etc.)
- **Command Descriptions**: Detailed explanation of each command's purpose
- **Configuration**: Resource limits, timeouts, and system settings
- **Statistics**: Command counts and category summaries

**Example:**
```json
{
  "name": "list_available_commands",
  "arguments": {}
}
```

**Sample Response:**
```json
{
  "workingDirectory": "/path/to/project",
  "totalCommands": 6,
  "categories": {
    "packageManagement": ["npm"],
    "versionControl": ["git"],
    "fileOperations": ["ls", "cat", "pwd"],
    "runtime": ["node"]
  },
  "commandDescriptions": {
    "npm": "Node.js package manager - install, update, and manage dependencies",
    "git": "Version control system - track changes and collaborate on code"
  },
  "configuration": {
    "maxCommandLength": 1000,
    "commandTimeout": "30000ms",
    "maxConcurrentCommands": 3
  }
}
```

#### `run_command`

Executes a whitelisted command in the configured directory.

**Parameters:**
- `command` (string, required): The command to execute

**Response:**
- Execution output (stdout/stderr)
- Execution time
- Error details (if applicable)

**Example:**
```json
{
  "name": "run_command",
  "arguments": {
    "command": "npm run build"
  }
}
```

## Development

### Prerequisites
- Node.js 18+
- TypeScript 5.8+
- Yarn or npm

### Setup

```bash
git clone https://github.com/nonameb3/safe-commander-mcp.git
cd safe-commander-mcp
yarn install
```

### Development Scripts

```bash
# Run in development mode
yarn dev

# Build for production
yarn build

# Run built version
yarn start

# Type checking
npx tsc --noEmit

# Run with MCP inspector for debugging
yarn start:mcp
```

### Testing Configuration

For testing, use a safe directory:

```bash
export ALLOWED_PATH="/tmp/safe-test-dir"
export ALLOWED_COMMANDS="ls,cat,pwd,echo"
yarn dev
```

## Troubleshooting

### Common Issues

**Error: "ALLOWED_PATH directory does not exist"**
- Ensure the path exists and is accessible
- Use absolute paths for reliability

**Error: "Command contains potentially dangerous characters"**
- The command contains blocked characters for security
- Review the command for injection attempts

**Error: "Command not in allowed list"**
- Add the command to `ALLOWED_COMMANDS` environment variable
- Ensure proper comma separation in the list
- Use `list_available_commands` tool to see what's available (v1.1.0+)

**JSON parsing errors in MCP client**
- Ensure no `console.log()` usage (outputs to stdout)
- All logging goes to stderr via the `log()` function

### New Features (v1.1.0+)

**Command Discovery**: Use the `list_available_commands` tool to:
- See all available commands organized by category
- Get detailed descriptions of what each command does
- View current configuration and resource limits
- Understand the working directory and security settings

This eliminates guesswork and enables Claude to provide more intelligent assistance.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Reporting Issues

Please use the [GitHub Issues](https://github.com/nonameb3/safe-commander-mcp/issues) page to report bugs or request features.

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This project prioritizes security. If you discover a security vulnerability, please send an email to roonnapai.dev@gmail.com instead of using the issue tracker.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## Acknowledgments

- Built with [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Inspired by the need for secure AI-driven development tools
- Thanks to the open-source community for continuous feedback and improvements
