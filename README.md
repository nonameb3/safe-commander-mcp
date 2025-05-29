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

**🛡️ Security-First Approach**: By default, only safe read-only commands are allowed to protect your codebase and data from unauthorized access.

Just add this configuration to your MCP client and you're ready to go:

```json
{
  "mcpServers": {
    "safe-commander": {
      "command": "npx",
      "args": ["-y", "safe-commander-mcp"],
      "env": {
        "ALLOWED_PATH": "/path/to/your/project",
        "ALLOWED_COMMANDS": "ls,cat,pwd,echo"
      }
    }
  }
}
```

**⚠️ CRITICAL SECURITY WARNING**:
- **The primary risk is the LLM itself** - it may attempt to access sensitive files or execute dangerous commands
- **Your codebase and data protection** is the main security concern - commands can read private files, source code, environment variables, etc.
- **Only add commands you fully understand** - each additional command expands what the LLM can access
- **You are responsible** for understanding the implications of every command you allow

That's it! The `npx -y` command will automatically download and run the latest version when needed.

## Configuration

### Required Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ALLOWED_PATH` | ✅ **Yes** | `/Users/yourname/projects/my-app` | Directory where commands can be executed (use absolute path) |
| `ALLOWED_COMMANDS` | No | `ls,cat,pwd,echo` | Comma-separated list of allowed commands |

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
        "ALLOWED_COMMANDS": "ls,cat,pwd,echo"
      }
    }
  }
}
```

**Step 3:** Replace `/Users/yourname/projects/my-project` with your actual project path.

**Step 4:** Restart Claude Desktop.

**Step 5:** Test by asking: *"What commands are available?"*

**🔒 Important**: The default commands (`ls,cat,pwd,echo`) are read-only and safe. To add more powerful commands like `npm`, `git`, or `python`, carefully consider the security implications - they may allow the LLM to read sensitive data, modify files, or execute arbitrary code.

### Other MCP Clients

For other MCP clients, use the same configuration format. The key points:
- **Command**: `npx`
- **Args**: `["-y", "safe-commander-mcp"]`
- **Environment**: Set `ALLOWED_PATH` and optionally `ALLOWED_COMMANDS`

## Real-World Examples

**⚠️ Security First**: All examples below add commands beyond the safe defaults. Each additional command increases LLM capabilities but also increases the risk of data exposure or unauthorized actions.

### For Web Development
```json
"ALLOWED_PATH": "/Users/yourname/projects/my-web-app"
"ALLOWED_COMMANDS": "ls,cat,pwd,echo,npm,git"
```
**Risk**: `npm` can install packages and run scripts. `git` can access repository history including commit messages, author information, file changes, and branch data.

### For Python Development
```json
"ALLOWED_PATH": "/Users/yourname/projects/my-python-app"
"ALLOWED_COMMANDS": "ls,cat,pwd,echo,python,pip,git"
```
**Risk**: `python` can execute arbitrary code and access any file. `pip` can install packages.

**⚠️ Security Note**: `ALLOWED_COMMANDS` can be customized to include any commands you need, but **carefully review each command** before adding it. More powerful commands enable more capable LLM assistance, but also introduce greater security risks. **The LLM is the primary threat** - it may attempt to read sensitive files, access credentials, or execute unauthorized operations.

### For Full-Stack Development
```json
"ALLOWED_PATH": "/Users/yourname/projects"
"ALLOWED_COMMANDS": "ls,cat,pwd,echo,npm,git,python,docker"
```
**Risk**: This configuration allows significant system access. `docker` can access containers and potentially the entire system.

**🔒 Security Reminder**: This example includes powerful commands that can access sensitive data, modify your system, or execute arbitrary code. Only use if you fully trust the LLM and understand the implications.

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

The following commands are included by default for security:
- `ls` - Directory listing (read-only)
- `cat` - File content reading (read-only) 
- `pwd` - Current directory (read-only)
- `echo` - Display text (safe output)

**Additional commands you might add (understand the risks first):**
- `git` - Version control operations (can access repository history including commit messages, author information, file changes, and branch data)
- `npm` - Package management (can install packages and run scripts)
- `python` - Script execution (can execute arbitrary code and access any file)
- `node` - JavaScript execution (can bypass all security protections)

**🚨 LLM Risk Warning**: Remember that the LLM itself is the primary security concern. Even with "safe" commands, an LLM could potentially:
- Use `cat` to read sensitive files like `.env`, `config.json`, private keys
- Use `ls` to discover the structure of your private codebase
- Combine multiple commands to extract sensitive information

Always ensure your `ALLOWED_PATH` points to a directory that doesn't contain sensitive data you wouldn't want the LLM to access.

### Custom Command Configuration

You can customize allowed commands for your specific needs, but always review each command carefully:

```json
{
  "env": {
    "ALLOWED_PATH": "/path/to/project",
    "ALLOWED_COMMANDS": "ls,cat,pwd,echo,npm,git"
  }
}
```

**🛡️ Security Guidelines for Command Selection:**
- **Start with defaults**: Begin with the secure defaults (`ls,cat,pwd,echo`)
- **Add incrementally**: Add new commands only when required for specific tasks
- **Understand LLM risks**: The LLM is the primary threat - it may try to access sensitive data
- **Review regularly**: Periodically audit your command list and remove unused commands
- **Principle of least privilege**: Only grant the minimum access needed
- **Data protection focus**: Consider what sensitive data the LLM could access with each command

**Common command categories and their risk levels:**
- **Minimal risk**: `ls`, `cat`, `pwd`, `echo` - Read-only file operations (but can still expose sensitive file contents)
- **Medium risk**: `git` - Version control with access to repository history including commit messages, author information, file changes, and branch data
- **High risk**: `npm`, `pip` - Package managers that can install software and run scripts
- **CRITICAL RISK**: `node`, `python`, `bash`, `sh` - **CAN BYPASS ALL SECURITY** and execute arbitrary system commands

## Security Features

### 🎯 **Primary Security Goal: Protect Your Data from LLMs and Third Parties**

Safe Commander MCP is designed to prevent unauthorized access to your sensitive codebase, files, and data. **The main threat is the LLM itself** - it may attempt to:
- Read sensitive files (credentials, private keys, source code)
- Access confidential business data
- Execute unauthorized operations
- Exfiltrate data to third parties

### ⚠️ Critical Security Considerations

**IMPORTANT: Command Execution Bypass Vulnerabilities**

Some commands can bypass the whitelist protection by executing other commands internally:

- **`node`**: Can execute ANY system command via `child_process` module
  ```bash
  # This bypasses all protections:
  node -e 'require("child_process").execSync("rm -rf /important/data")'
  ```
- **`python`**: Can execute system commands via `os.system()` or `subprocess`
- **`bash`/`sh`**: Direct shell access bypasses all protections
- **`npm`**: Can run scripts that execute arbitrary commands

**Recommendation**: Only include `node` or `python` if you fully trust the LLM and understand the risks. For maximum security, use only read-only commands like `ls`, `cat`, `pwd`.

### Command Validation
- **Whitelist-only**: Only pre-approved commands can be executed
- **Character sanitization**: Dangerous characters (`; & | \` $ ( ) { } [ ] < >`) are blocked
- **Path validation**: Prevents directory traversal attacks
- **Length limits**: Commands are limited to 1000 characters

**Note**: Character sanitization provides limited protection against commands that have built-in execution capabilities like `node` or `python`.

### Resource Limits
- **Execution timeout**: 30 seconds maximum per command
- **Output size limit**: 1MB maximum output
- **Concurrent commands**: Maximum 3 simultaneous executions
- **Rate limiting**: 1-second cooldown between identical commands

### Directory Restrictions
All commands are executed within the configured `ALLOWED_PATH` directory, preventing access to sensitive system areas.

## 🔍 Quick Security Check

Before adding any command to your whitelist, ask yourself:
- Can this command read files I don't want the LLM to see?
- Can this command execute other commands or scripts? 
- What's the worst thing that could happen if the LLM runs this command?
- Do I trust the LLM with this level of access to my system?

**Remember**: The LLM is curious and will explore. Only grant access to what you're comfortable with it discovering.

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
