# Contributing to Safe Commander MCP

Thank you for your interest in contributing to Safe Commander MCP! We welcome contributions from the community and are pleased to have you aboard.

## Code of Conduct

This project and everyone participating in it are governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to roonnapai.dev@gmail.com.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include relevant log output**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain the behavior you expected to see**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints (run `npx tsc --noEmit`)
5. Issue that pull request!

## Development Setup

### Prerequisites

- Node.js 18 or higher
- Yarn or npm
- TypeScript 5.8+

### Setting Up Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/nonameb3/safe-commander-mcp.git
   cd safe-commander-mcp
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables for testing**
   ```bash
   export ALLOWED_PATH="/tmp/safe-test-dir"
   export ALLOWED_COMMANDS="ls,cat,pwd,echo"
   mkdir -p /tmp/safe-test-dir
   ```

4. **Run in development mode**
   ```bash
   yarn dev
   ```

### Development Scripts

- `yarn dev` - Run in development mode with tsx
- `yarn build` - Build for production
- `yarn start` - Run built version
- `npx tsc --noEmit` - Type checking
- `yarn start:mcp` - Run with MCP inspector for debugging

## Coding Standards

### TypeScript Guidelines

- **Use TypeScript strictly** - No `any` types unless absolutely necessary
- **Define interfaces** for all data structures
- **Use proper error handling** with typed errors
- **Document complex functions** with JSDoc comments

### Security Guidelines

- **Never use `console.log()`** - All output must go to stderr via the `log()` function
- **Validate all inputs** - Especially commands and paths
- **Follow the principle of least privilege** - Restrict access as much as possible
- **Test security features thoroughly** - Ensure validation works correctly

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use meaningful variable and function names
- Keep functions focused and small
- Add comments for complex logic

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code changes that neither fix bugs nor add features
- `test:` adding tests
- `chore:` maintenance tasks

Examples:
```
feat: add support for Python commands
fix: prevent path traversal in file validation
docs: update installation instructions
security: enhance command sanitization
```

## Testing

### Manual Testing

1. **Test with valid configuration**
   ```bash
   ALLOWED_PATH="/tmp/safe-test" ALLOWED_COMMANDS="ls,cat" yarn dev
   ```

2. **Test with invalid configuration**
   ```bash
   ALLOWED_PATH="/nonexistent" yarn dev  # Should fail
   ```

3. **Test dangerous commands**
   - Try commands with dangerous characters
   - Test path traversal attempts
   - Verify rate limiting works

### Security Testing

Always test security features:
- Path traversal prevention
- Command injection protection
- Resource limits
- Rate limiting
- Startup validation

## Project Structure

```
safe-commander-mcp/
├── index.ts              # Main server implementation
├── interface/            # TypeScript interfaces
│   └── index.ts
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── README.md             # Project documentation
├── CHANGELOG.md          # Version history
├── CONTRIBUTING.md       # This file
├── LICENSE               # MIT License
└── dist/                 # Built files (generated)
```

## Questions?

Don't hesitate to reach out if you have questions:
- Open an issue for discussion
- Contact the maintainers
- Check existing issues and pull requests

Thank you for contributing! 🎉 