🎉 **Initial Release of Safe Commander MCP**

A secure MCP server for executing whitelisted development commands with comprehensive security controls and resource limits.

## ✨ Features

### 🔒 Security First
- Command whitelisting with configurable allowed commands
- Path traversal prevention and directory restrictions  
- Command injection protection with character sanitization
- Resource limits (timeout, output size, concurrent commands)
- Startup validation to catch configuration issues early

### ⚡ Performance & Monitoring
- Execution time tracking and detailed logging
- Rate limiting with command cooldowns (1-second minimum between same commands)
- Concurrent command management (configurable limit)
- Graceful shutdown handling with cleanup

### 🛠️ Developer Friendly
- TypeScript implementation with full type safety
- Comprehensive error messages and debugging logs
- Environment-based configuration
- Production-ready logging to stderr (MCP-compliant)

## 📦 Installation

```bash
npm install -g safe-commander-mcp
```

## 🚀 Quick Start

```json
{
  "mcpServers": {
    "safe-commander": {
      "command": "safe-commander-mcp",
      "env": {
        "ALLOWED_PATH": "/path/to/your/project",
        "ALLOWED_COMMANDS": "npm,git,ls,cat,pwd,node"
      }
    }
  }
}
```

## 🔗 Links
- **NPM Package**: https://www.npmjs.com/package/safe-commander-mcp
- **Documentation**: https://github.com/nonameb3/safe-commander-mcp#readme
- **Issues**: https://github.com/nonameb3/safe-commander-mcp/issues 