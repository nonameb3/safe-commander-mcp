🔧 **Compatibility Fix Release**

Fixed Node.js compatibility issue that prevented the MCP server from running on Node.js v18.x.

## 🐛 Fixed
- **Node.js Compatibility**: Replaced `with { type: "json" }` import assertion with `createRequire` approach
- **Broader Support**: Now compatible with Node.js 18.x versions used by most MCP clients
- **Error Resolution**: Fixed `SyntaxError: Unexpected token 'with'` when running on older Node.js versions

## 📦 Installation

```bash
npm install -g safe-commander-mcp@latest
```

## 🔄 Upgrade from v1.0.0

If you installed v1.0.0 and encountered the syntax error, simply update:

```bash
npm install -g safe-commander-mcp@latest
```

## 🔗 Links
- **NPM Package**: https://www.npmjs.com/package/safe-commander-mcp
- **Documentation**: https://github.com/nonameb3/safe-commander-mcp#readme
- **Issues**: https://github.com/nonameb3/safe-commander-mcp/issues 