# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.4] - 2025-01-17

### 🔒 MAJOR SECURITY OVERHAUL - BREAKING CHANGE
- **Security-First Transformation**: Changed default configuration from functionality-first to security-first approach
- **Safe Defaults**: Default allowed commands changed from `['npm', 'git', 'ls', 'cat', 'pwd', 'node']` to `['ls', 'cat', 'pwd', 'echo']` (read-only only)
- **Critical Vulnerability Documentation**: Added comprehensive warnings about commands that can bypass security protections

### ⚠️ Security Enhancements
- **Command Bypass Vulnerability Disclosure**: Documented critical risk of `node`, `python`, `bash`, `sh` commands that can bypass all protections
- **Enhanced Security Warnings**: Added runtime detection and warnings for dangerous commands
- **LLM Risk Focus**: Emphasized that "LLM is the primary threat" in all documentation
- **Data Protection Priority**: Focused security messaging on protecting codebase and sensitive data from unauthorized access

### 📚 Documentation Overhaul
- **Security-First README**: Complete rewrite prioritizing security over functionality
- **Risk Level Classifications**: 
  - Minimal risk: `ls`, `cat`, `pwd`, `echo`
  - Medium risk: `git` (repository history access)
  - High risk: `npm`, `pip` (package managers)
  - CRITICAL RISK: `node`, `python`, `bash`, `sh` (can bypass all security)
- **Quick Security Check**: Added guidance questions before adding commands
- **Comprehensive Command Risk Explanations**: Detailed risk analysis for each command type
- **Consistent Security Messaging**: All examples now include proper security warnings

### 🛡️ Code Security Improvements
- **Secure Default Configuration**: All basic examples use safe read-only commands by default
- **Enhanced Security Logging**: Improved security-focused log messages
- **Runtime Security Warnings**: Added detection and warnings for dangerous command configurations

### Migration Notes
- **BREAKING**: Default commands changed - existing users should review their configurations
- **Action Required**: Users with previous configurations should explicitly set `ALLOWED_COMMANDS` to maintain previous functionality
- **Security Review**: All users should review their command allowlists against the new risk classifications

## [1.1.3] - 2025-01-17

### Documentation
- **Simplified Setup Process**: Completely rewritten installation and configuration sections
- **No Installation Required**: Emphasized npx approach - users can start immediately without global installation
- **Reduced Repetition**: Consolidated multiple MCP configuration examples into one main config with variable examples
- **Enhanced Security Guidance**: Added comprehensive command selection guidelines with risk levels
- **Better Real-World Examples**: Clearer examples for Web Development, Python Development, and Full-Stack Development
- **Improved Development Setup**: Enhanced contributing section with step-by-step development instructions

### User Experience
- **Easier Onboarding**: Users can copy-paste configuration and start using immediately
- **Clear Security Warnings**: Better guidance on command selection and security implications
- **Streamlined Documentation**: Removed redundant configuration examples while maintaining all essential information

## [1.1.2] - 2025-01-17

### Documentation
- Updated README.md with comprehensive `list_available_commands` feature documentation
- Enhanced usage examples and API reference for intelligent command discovery
- Added troubleshooting information and version-specific feature notes
- Improved main description to highlight revolutionary command discovery capabilities

## [1.1.1] - 2025-01-17

### Fixed
- Fixed package.json import path for compiled TypeScript output
- Resolved "Cannot find module '../../package.json'" error when running the built application
- Corrected relative path from `../../package.json` to `../../../package.json` in mcp-server.ts

## [1.1.0] - 2025-01-17

### Added
- **NEW TOOL: `list_available_commands`** - Revolutionary command discovery system
  - Intelligent command categorization by type (package management, version control, file operations, etc.)
  - Comprehensive command descriptions with detailed explanations
  - Real-time configuration reporting (working directory, limits, timeouts)
  - Category-based command summary and statistics
  - Enhanced MCP tool enumeration with command validation

### Enhanced
- **Proactive Command Assistance**: Transform from "trial and error" command discovery to intelligent assistance
  - Claude can now query available commands without guessing
  - Workflow suggestions based on available command categories
  - Better user experience with organized command presentation
  - Security-first error messages that don't leak configuration information

### Developer Experience  
- Enhanced MCP tool schema with command enumeration for better Claude integration
- Improved command validation with detailed categorization feedback
- Comprehensive command registry with descriptions and safety classifications
- Better debugging capabilities with command validation reporting

### Security
- Secure command enumeration without configuration information leakage
- Enhanced error messages that maintain security while providing helpful guidance
- Command validation improvements with category-based safety checks

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
