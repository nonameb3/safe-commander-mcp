import { validateCommand, isCommandValid, getBaseCommand } from '../../src/commands/command-validator';

describe('Command Validator', () => {
  describe('getBaseCommand', () => {
    test('should extract command name from simple commands', () => {
      expect(getBaseCommand('npm')).toBe('npm');
      expect(getBaseCommand('git')).toBe('git');
      expect(getBaseCommand('ls')).toBe('ls');
    });

    test('should extract command name from commands with arguments', () => {
      expect(getBaseCommand('npm install')).toBe('npm');
      expect(getBaseCommand('git status')).toBe('git');
      expect(getBaseCommand('ls -la')).toBe('ls');
    });

    test('should handle commands with flags', () => {
      expect(getBaseCommand('npm install --save-dev')).toBe('npm');
      expect(getBaseCommand('git commit -m "message"')).toBe('git');
    });

    test('should handle empty and whitespace commands', () => {
      expect(getBaseCommand('')).toBe('');
      expect(getBaseCommand('  ')).toBe('');
      expect(getBaseCommand('\t\n')).toBe('');
    });
  });

  describe('isCommandValid', () => {
    test('should return valid: true for allowed commands', () => {
      expect(isCommandValid('npm')).toEqual({ valid: true });
      expect(isCommandValid('git')).toEqual({ valid: true });
      expect(isCommandValid('ls')).toEqual({ valid: true });
      expect(isCommandValid('cat')).toEqual({ valid: true });
      expect(isCommandValid('pwd')).toEqual({ valid: true });
      expect(isCommandValid('node')).toEqual({ valid: true });
    });

    test('should return valid: false for disallowed commands', () => {
      const result1 = isCommandValid('rm');
      const result2 = isCommandValid('sudo');
      const result3 = isCommandValid('chmod');
      
      expect(result1.valid).toBe(false);
      expect(result1.error).toBeDefined();
      expect(result2.valid).toBe(false);
      expect(result2.error).toBeDefined();
      expect(result3.valid).toBe(false);
      expect(result3.error).toBeDefined();
    });

    test('should handle complex commands', () => {
      expect(isCommandValid('npm install --save-dev')).toEqual({ valid: true });
      expect(isCommandValid('git status')).toEqual({ valid: true });
    });
  });

  describe('validateCommand', () => {
    test('should allow valid commands with allowed base commands', () => {
      expect(() => validateCommand('npm install')).not.toThrow();
      expect(() => validateCommand('git status')).not.toThrow();
      expect(() => validateCommand('ls -la')).not.toThrow();
    });

    test('should reject commands with disallowed base commands', () => {
      expect(() => validateCommand('rm -rf /')).toThrow();
      expect(() => validateCommand('sudo rm')).toThrow();
      expect(() => validateCommand('chmod +x file')).toThrow();
    });

    test('should reject empty commands', () => {
      expect(() => validateCommand('')).toThrow();
      expect(() => validateCommand('  ')).toThrow();
    });

    test('should handle commands with complex arguments', () => {
      expect(() => validateCommand('npm install --save-dev @types/jest')).not.toThrow();
      expect(() => validateCommand('git commit -m "Add tests"')).not.toThrow();
    });

    test('should provide secure error messages', () => {
      expect(() => validateCommand('dangerous_cmd')).toThrow(/not permitted/);
      expect(() => validateCommand('')).toThrow(/non-empty string/);
    });

    test('should handle path validation for path-sensitive commands', () => {
      expect(() => validateCommand('cat file.txt')).not.toThrow();
      expect(() => validateCommand('ls .')).not.toThrow();
      expect(() => validateCommand('cat ../../../etc/passwd')).toThrow();
    });
  });
}); 