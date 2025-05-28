import { validatePath } from '../../src/security/path-validator';

describe('Path Validator', () => {
  const allowedPath = '/tmp';

  describe('validatePath', () => {
    test('should allow paths within the allowed directory', () => {
      expect(() => validatePath('.', allowedPath)).not.toThrow();
      expect(() => validatePath('./subfolder', allowedPath)).not.toThrow();
      expect(() => validatePath('file.txt', allowedPath)).not.toThrow();
    });

    test('should reject path traversal attempts', () => {
      expect(() => validatePath('..', allowedPath)).toThrow();
      expect(() => validatePath('../', allowedPath)).toThrow();
      expect(() => validatePath('../../../etc/passwd', allowedPath)).toThrow();
      expect(() => validatePath('./../../etc', allowedPath)).toThrow();
    });

    test('should reject absolute paths outside allowed directory', () => {
      expect(() => validatePath('/etc/passwd', allowedPath)).toThrow();
      expect(() => validatePath('/home/user', allowedPath)).toThrow();
      expect(() => validatePath('/root', allowedPath)).toThrow();
    });

    test('should allow the exact allowed path', () => {
      expect(() => validatePath('/tmp', allowedPath)).not.toThrow();
      expect(() => validatePath('/tmp/', allowedPath)).not.toThrow();
    });

    test('should allow paths that start with allowed path', () => {
      expect(() => validatePath('/tmp/subfolder', allowedPath)).not.toThrow();
      expect(() => validatePath('/tmp/file.txt', allowedPath)).not.toThrow();
    });

    test('should reject paths that only partially match allowed path', () => {
      expect(() => validatePath('/tmpfile', allowedPath)).toThrow();
      expect(() => validatePath('/tmp_backup', allowedPath)).toThrow();
    });

    test('should handle complex path traversal attempts', () => {
      expect(() => validatePath('folder/../../../etc', allowedPath)).toThrow();
      expect(() => validatePath('./valid/../../invalid', allowedPath)).toThrow();
      expect(() => validatePath('valid/folder/../../..', allowedPath)).toThrow();
    });

    test('should handle empty and invalid paths', () => {
      expect(() => validatePath('', allowedPath)).not.toThrow(); // Empty path defaults to current dir
      expect(() => validatePath('  ', allowedPath)).not.toThrow(); // Whitespace path
    });
  });
}); 