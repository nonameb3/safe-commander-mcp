# Publishing Checklist for Safe Commander MCP

## Pre-Publication Checklist

### 1. Update Personal Information
- [x] Replace `yourusername` with your actual GitHub username in:
  - [x] `README.md` (repository URLs)
  - [x] `package.json` (repository, homepage, bugs URLs)
  - [x] `CONTRIBUTING.md` (clone URLs)
- [x] Replace `Your Name <your-email@domain.com>` with your actual name and email in:
  - [x] `package.json` (author field)
  - [x] `CONTRIBUTING.md` (contact information)
- [x] Replace `[your-email@domain.com]` with your actual email in:
  - [x] `CONTRIBUTING.md` 
  - [x] `README.md` (security section)

### 2. Test the Package
- [ ] Run `yarn build` to ensure clean build
- [ ] Test with valid configuration: `ALLOWED_PATH=/tmp ALLOWED_COMMANDS=ls,cat yarn dev`
- [ ] Test with invalid configuration to ensure it fails properly
- [ ] Test the binary: `node dist/index.js` with environment variables
- [ ] Run `npm pack --dry-run` to verify package contents

### 3. GitHub Repository Setup
- [x] Create repository on GitHub with the same name (`safe-commander-mcp`)
- [ ] Push all files to GitHub:
  ```bash
  git add .
  git commit -m "feat: initial release v1.0.0"
  git remote add origin https://github.com/nonameb3/safe-commander-mcp.git
  git push -u origin main
  ```
- [ ] Create a release tag:
  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  ```
- [ ] Set up GitHub repository description and topics

### 4. NPM Publication
- [ ] Login to npm: `npm login`
- [ ] Verify package name is available: `npm view safe-commander-mcp`
- [ ] Build the package: `yarn build`
- [ ] Publish to npm: `npm publish`

### 5. Documentation and Community
- [ ] Create GitHub release notes for v1.0.0
- [ ] Enable GitHub Issues
- [ ] Set up GitHub repository topics/tags: `mcp`, `security`, `ai-tools`, `typescript`
- [ ] Consider creating GitHub repository templates for issues

## Post-Publication

### Verification
- [ ] Verify npm package: `npm view safe-commander-mcp`
- [ ] Test global installation: `npm install -g safe-commander-mcp`
- [ ] Test the installed binary: `safe-commander-mcp` (should show configuration errors)
- [ ] Check package appears on npm website

### Promotion
- [ ] Share on relevant communities (Reddit, Discord, etc.)
- [ ] Consider writing a blog post about the security features
- [ ] Update your portfolio/resume with the open-source project

## Version Management

For future updates:
1. Update version in `package.json`
2. Update `CHANGELOG.md` with new features/fixes
3. Run `yarn build`
4. Commit changes
5. Create git tag: `git tag v1.x.x`
6. Push: `git push && git push --tags`
7. Publish: `npm publish`

## Package URLs After Publication
- NPM: `https://www.npmjs.com/package/safe-commander-mcp`
- GitHub: `https://github.com/nonameb3/safe-commander-mcp`
- Documentation: `https://github.com/nonameb3/safe-commander-mcp#readme`

## Monitoring
- [ ] Set up npm package monitoring
- [ ] Monitor GitHub issues and discussions
- [ ] Track download statistics
- [ ] Watch for security vulnerabilities 