# Safe Commander MCP

[![npm version](https://badge.fury.io/js/safe-commander-mcp.svg)](https://badge.fury.io/js/safe-commander-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)

A secure MCP (Model Context Protocol) server for executing whitelisted development commands with comprehensive security controls and resource limits. Perfect for AI assistants that need safe command execution capabilities.

## Features

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

## Installation

### Via npm (Recommended)

```bash
npm install -g safe-commander-mcp
```

### Via yarn

```bash
yarn global add safe-commander-mcp
```

### From source

```bash
git clone https://github.com/nonameb3/safe-commander-mcp.git
cd safe-commander-mcp
yarn install
yarn build
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ALLOWED_PATH` | ✅ Yes | - | Base directory where commands can be executed |
| `ALLOWED_COMMANDS` | No | `npm,git,ls,cat,pwd,node` | Comma-separated list of allowed commands |

### MCP Client Configuration

Add this to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "safe-commander": {
      "command": "safe-commander-mcp",
      "env": {
        "ALLOWED_PATH": "/path/to/your/project",
        "ALLOWED_COMMANDS": "npm,git,ls,cat,pwd,node,python"
      }
    }
  }
}
```

#### Claude Desktop Configuration

For Claude Desktop, edit your configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "safe-commander": {
      "command": "npx",
      "args": ["safe-commander-mcp"],
      "env": {
        "ALLOWED_PATH": "/Users/yourname/projects/my-project",
        "ALLOWED_COMMANDS": "npm,yarn,git,ls,cat,pwd,node"
      }
    }
  }
}
```

## Usage Examples

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

You can customize allowed commands for your specific needs:

```json
{
  "env": {
    "ALLOWED_PATH": "/path/to/project",
    "ALLOWED_COMMANDS": "npm,yarn,pnpm,git,ls,cat,pwd,node,python,pip,poetry"
  }
}
```

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

### Available Tool

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

**JSON parsing errors in MCP client**
- Ensure no `console.log()` usage (outputs to stdout)
- All logging goes to stderr via the `log()` function

### Debug Mode

Enable debug logging by setting the log level:

```typescript
// In development, you can modify the log function to show debug messages
```

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
