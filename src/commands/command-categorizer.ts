/**
 * Command categorization and description module
 * SAFETY-FIRST: This module must handle unknown commands gracefully and never crash
 */

/** Command category interface with comprehensive categorization */
export interface CommandCategory {
  packageManagement: string[];
  versionControl: string[];
  fileOperations: string[];
  runtime: string[];
  frameworks: string[];
  containerization: string[];
  networking: string[];
  buildTools: string[];
  testing: string[];
  other: string[]; // CRITICAL: Fallback for unknown commands
}

/** Command information interface */
export interface CommandInfo {
  command: string;
  category: keyof CommandCategory;
  description: string;
  commonUsage: string[];
}

/** Validation result for command mappings */
export interface CommandValidationResult {
  known: string[];
  unknown: string[];
  valid: boolean;
  missingDescriptions: string[];
  missingCategories: string[];
}

/**
 * SAFETY-FIRST: Command to category mapping
 * If a command is not in this mapping, it will fallback to 'other' category
 */
const COMMAND_CATEGORIES: Record<string, keyof CommandCategory> = {
  // Package Management
  npm: 'packageManagement',
  yarn: 'packageManagement',
  pnpm: 'packageManagement',
  
  // Version Control
  git: 'versionControl',
  gh: 'versionControl',
  
  // File Operations
  ls: 'fileOperations',
  cat: 'fileOperations',
  pwd: 'fileOperations',
  find: 'fileOperations',
  grep: 'fileOperations',
  head: 'fileOperations',
  tail: 'fileOperations',
  
  // Runtime
  node: 'runtime',
  python: 'runtime',
  python3: 'runtime',
  
  // Frameworks
  nest: 'frameworks',
  next: 'frameworks',
  vue: 'frameworks',
  nuxt: 'frameworks',
  
  // Containerization
  docker: 'containerization',
  'docker-compose': 'containerization',
  
  // Networking
  curl: 'networking',
  wget: 'networking',
  
  // Build Tools
  make: 'buildTools',
  cmake: 'buildTools',
  tsc: 'buildTools',
  webpack: 'buildTools',
  
  // Testing
  jest: 'testing',
  mocha: 'testing',
  vitest: 'testing'
};

/**
 * SAFETY-FIRST: Command descriptions
 * If a description is not defined, a fallback will be provided
 */
const COMMAND_DESCRIPTIONS: Record<string, string> = {
  // Package Management
  npm: "Node.js package manager - install dependencies, run scripts, manage packages",
  yarn: "Fast, reliable package manager - alternative to npm with better performance",
  pnpm: "Efficient package manager - uses hard links to save disk space",
  
  // Version Control
  git: "Version control system - track changes, manage branches, collaborate on code",
  gh: "GitHub CLI - interact with GitHub repositories from command line",
  
  // File Operations
  ls: "List directory contents with detailed file information and permissions",
  cat: "Display file contents in terminal - view text files quickly",
  pwd: "Print current working directory path - show where you are",
  find: "Search for files and directories based on various criteria",
  grep: "Search text patterns within files - powerful text searching tool",
  head: "Display first lines of files - preview file beginnings",
  tail: "Display last lines of files - monitor file endings and logs",
  
  // Runtime
  node: "Execute Node.js JavaScript files and scripts - run JS applications",
  python: "Execute Python scripts and applications - run Python code",
  python3: "Execute Python 3 scripts and applications - modern Python runtime",
  
  // Frameworks
  nest: "NestJS framework CLI - create and manage NestJS applications",
  next: "Next.js framework CLI - create and manage React applications",
  vue: "Vue.js framework CLI - create and manage Vue applications",
  nuxt: "Nuxt.js framework CLI - create and manage Vue/Nuxt applications",
  
  // Containerization
  docker: "Container platform - build, run, and manage containers",
  'docker-compose': "Multi-container Docker applications - orchestrate container services",
  
  // Networking
  curl: "Transfer data to/from servers - make HTTP requests and download files",
  wget: "Download files from web - retrieve files via HTTP/HTTPS/FTP",
  
  // Build Tools
  make: "Build automation tool - compile and build projects using Makefiles",
  cmake: "Cross-platform build system - generate build files for various platforms",
  tsc: "TypeScript compiler - compile TypeScript to JavaScript",
  webpack: "Module bundler - bundle JavaScript modules for web applications",
  
  // Testing
  jest: "JavaScript testing framework - unit and integration testing",
  mocha: "JavaScript test framework - flexible testing with various assertion libraries",
  vitest: "Fast unit testing framework - Vite-powered testing tool"
};

/**
 * CRITICAL: Safely categorize commands with fallback handling
 * Unknown commands are placed in 'other' category to prevent crashes
 * 
 * @param commands - Array of command names to categorize
 * @returns CommandCategory object with commands organized by category
 */
export function categorizeCommands(commands: string[]): CommandCategory {
  const categories: CommandCategory = {
    packageManagement: [],
    versionControl: [],
    fileOperations: [],
    runtime: [],
    frameworks: [],
    containerization: [],
    networking: [],
    buildTools: [],
    testing: [],
    other: []
  };

  for (const command of commands) {
    const category = COMMAND_CATEGORIES[command];
    if (category && categories[category]) {
      categories[category].push(command);
    } else {
      // SAFETY: Unknown commands go to 'other' - NEVER crash
      categories.other.push(command);
    }
  }

  return categories;
}

/**
 * CRITICAL: Safely get command descriptions with fallback handling
 * Missing descriptions get a helpful fallback message
 * 
 * @param commands - Array of command names
 * @returns Record of command to description mappings
 */
export function getCommandDescriptions(commands: string[]): Record<string, string> {
  const descriptions: Record<string, string> = {};
  
  for (const command of commands) {
    descriptions[command] = COMMAND_DESCRIPTIONS[command] || 
      `${command} - Command available but description not defined`;
  }
  
  return descriptions;
}

/**
 * Get detailed information about a specific command
 * 
 * @param command - Command name to get info for
 * @returns CommandInfo object or null if command not recognized
 */
export function getCommandInfo(command: string): CommandInfo | null {
  const category = COMMAND_CATEGORIES[command];
  const description = COMMAND_DESCRIPTIONS[command];
  
  if (!category && !description) {
    return null;
  }
  
  return {
    command,
    category: category || 'other',
    description: description || `${command} - Command available but description not defined`,
    commonUsage: getCommonUsage(command)
  };
}

/**
 * CRITICAL: Validate command mappings to help identify missing configurations
 * This function helps developers find commands that need categorization/descriptions
 * 
 * @param commands - Array of commands to validate
 * @returns ValidationResult with known/unknown commands and missing info
 */
export function validateCommandCategories(commands: string[]): CommandValidationResult {
  const known: string[] = [];
  const unknown: string[] = [];
  const missingDescriptions: string[] = [];
  const missingCategories: string[] = [];
  
  for (const command of commands) {
    const hasCategory = command in COMMAND_CATEGORIES;
    const hasDescription = command in COMMAND_DESCRIPTIONS;
    
    if (hasCategory && hasDescription) {
      known.push(command);
    } else {
      unknown.push(command);
      
      if (!hasCategory) {
        missingCategories.push(command);
      }
      if (!hasDescription) {
        missingDescriptions.push(command);
      }
    }
  }
  
  return {
    known,
    unknown,
    valid: unknown.length === 0,
    missingDescriptions,
    missingCategories
  };
}

/**
 * Get common usage examples for a command
 * 
 * @param command - Command name
 * @returns Array of common usage examples
 */
function getCommonUsage(command: string): string[] {
  const usageExamples: Record<string, string[]> = {
    npm: ["npm install", "npm run build", "npm test", "npm start"],
    git: ["git status", "git add .", "git commit -m", "git push"],
    ls: ["ls -la", "ls -l", "ls *.js"],
    cat: ["cat package.json", "cat README.md"],
    node: ["node index.js", "node --version"],
    docker: ["docker ps", "docker build", "docker run"]
  };
  
  return usageExamples[command] || [`${command} --help`];
}

/**
 * Get a summary of available commands by category
 * 
 * @param commands - Array of commands to summarize
 * @returns Object with category counts and totals
 */
export function getCommandSummary(commands: string[]): {
  totalCommands: number;
  categoryCounts: Record<keyof CommandCategory, number>;
  topCategories: Array<{ category: keyof CommandCategory; count: number }>;
} {
  const categories = categorizeCommands(commands);
  const categoryCounts: Record<keyof CommandCategory, number> = {} as Record<keyof CommandCategory, number>;
  
  for (const [category, cmds] of Object.entries(categories)) {
    categoryCounts[category as keyof CommandCategory] = cmds.length;
  }
  
  const topCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category: category as keyof CommandCategory, count }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count);
  
  return {
    totalCommands: commands.length,
    categoryCounts,
    topCategories
  };
} 