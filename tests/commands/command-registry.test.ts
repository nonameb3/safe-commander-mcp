import { 
  COMMAND_CATEGORIES, 
  getAllowedCommands, 
  getCommandsByCategory, 
  getCommandCategory,
  isCommandAllowed,
  getCommandDescription
} from '../../src/commands/command-registry';

describe('Command Registry', () => {
  describe('COMMAND_CATEGORIES', () => {
    test('should have defined command categories', () => {
      expect(COMMAND_CATEGORIES).toBeDefined();
      expect(COMMAND_CATEGORIES.PACKAGE_MANAGERS).toContain('npm');
      expect(COMMAND_CATEGORIES.VERSION_CONTROL).toContain('git');
      expect(COMMAND_CATEGORIES.FILE_OPERATIONS).toContain('ls');
    });
  });

  describe('getAllowedCommands', () => {
    test('should return array of allowed commands', () => {
      const commands = getAllowedCommands();
      expect(Array.isArray(commands)).toBe(true);
      expect(commands.length).toBeGreaterThan(0);
      expect(commands).toContain('npm');
      expect(commands).toContain('git');
    });

    test('should return a copy of the commands array', () => {
      const commands1 = getAllowedCommands();
      const commands2 = getAllowedCommands();
      expect(commands1).not.toBe(commands2); // Different array instances
      expect(commands1).toEqual(commands2); // Same content
    });
  });

  describe('getCommandsByCategory', () => {
    test('should return commands for valid categories', () => {
      const packageCommands = getCommandsByCategory('PACKAGE_MANAGERS');
      const versionControlCommands = getCommandsByCategory('VERSION_CONTROL');
      
      expect(Array.isArray(packageCommands)).toBe(true);
      expect(Array.isArray(versionControlCommands)).toBe(true);
      
      // These should only include commands that are both in the category AND allowed
      expect(packageCommands.every(cmd => getAllowedCommands().includes(cmd))).toBe(true);
      expect(versionControlCommands.every(cmd => getAllowedCommands().includes(cmd))).toBe(true);
    });

    test('should filter by allowed commands', () => {
      // If npm is in both categories and allowed commands, it should appear
      const allowedCommands = getAllowedCommands();
      const packageCommands = getCommandsByCategory('PACKAGE_MANAGERS');
      
      if (allowedCommands.includes('npm')) {
        expect(packageCommands).toContain('npm');
      }
    });
  });

  describe('getCommandCategory', () => {
    test('should return correct category for known commands', () => {
      expect(getCommandCategory('npm')).toBe('PACKAGE_MANAGERS');
      expect(getCommandCategory('git')).toBe('VERSION_CONTROL');
      expect(getCommandCategory('ls')).toBe('FILE_OPERATIONS');
    });

    test('should return OTHER for unknown commands', () => {
      expect(getCommandCategory('unknown_command')).toBe('OTHER');
      expect(getCommandCategory('nonexistent')).toBe('OTHER');
    });

    test('should handle empty strings', () => {
      expect(getCommandCategory('')).toBe('OTHER');
    });
  });

  describe('isCommandAllowed', () => {
    test('should return true for allowed commands', () => {
      const allowedCommands = getAllowedCommands();
      allowedCommands.forEach(command => {
        expect(isCommandAllowed(command)).toBe(true);
      });
    });

    test('should return false for disallowed commands', () => {
      expect(isCommandAllowed('rm')).toBe(false);
      expect(isCommandAllowed('sudo')).toBe(false);
      expect(isCommandAllowed('unknown')).toBe(false);
    });
  });

  describe('getCommandDescription', () => {
    test('should return a string description', () => {
      const description = getCommandDescription();
      expect(typeof description).toBe('string');
      expect(description.length).toBeGreaterThan(0);
    });

    test('should include allowed commands in description', () => {
      const description = getCommandDescription();
      const allowedCommands = getAllowedCommands();
      
      // Description should mention some of the allowed commands
      allowedCommands.forEach(command => {
        expect(description).toContain(command);
      });
    });
  });
}); 