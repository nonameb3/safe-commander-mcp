# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-05-27

### Fixed
- Fixed Node.js compatibility issue with JSON import syntax
- Replaced `with { type: "json" }` import assertion with `createRequire` for broader Node.js version support
- Now compatible with Node.js 18.x versions

## [1.0.0] - 2025-05-27

### Added
- Initial release of Safe Commander MCP
- Secure command execution with whitelist-based validation
- Path traversal prevention and directory restrictions
- Command injection protection with character sanitization
- Resource limits (timeout, output size, concurrent commands)
- Rate limiting with command cooldowns
- Comprehensive startup validation
- TypeScript implementation with full type safety
- Environment-based configuration
- Production-ready logging to stderr (MCP-compliant)
- Graceful shutdown handling with cleanup
- Support for npm, git, ls, cat, pwd, and node commands by default

### Security
- Whitelist-only command execution
- Dangerous character filtering (`; & | \` $ ( ) { } [ ] < >`)
- Path validation to prevent directory traversal
- Resource limits to prevent abuse
- Startup validation to catch misconfigurations early

### Developer Experience
- Detailed error messages and debugging logs
- Execution time tracking
- Configuration validation at startup
- TypeScript definitions for all interfaces
- Comprehensive README with usage examples 
