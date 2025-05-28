import { sanitizeCommand } from "../../src/security/sanitizer";

describe("Command Sanitizer", () => {
  describe("sanitizeCommand", () => {
    test("should allow basic safe commands", () => {
      expect(sanitizeCommand("npm install")).toBe("npm install");
      expect(sanitizeCommand("git status")).toBe("git status");
      expect(sanitizeCommand("ls -la")).toBe("ls -la");
    });

    test("should handle single word commands", () => {
      expect(sanitizeCommand("pwd")).toBe("pwd");
      expect(sanitizeCommand("node")).toBe("node");
    });

    test("should trim whitespace", () => {
      expect(sanitizeCommand("  npm install  ")).toBe("npm install");
      expect(sanitizeCommand("\tgit status\n")).toBe("git status");
    });

    test("should handle empty strings", () => {
      expect(() => sanitizeCommand("")).toThrow();
      expect(sanitizeCommand("   ")).toBe("");
    });

    test("should preserve valid command arguments", () => {
      expect(sanitizeCommand("npm install --save-dev jest")).toBe("npm install --save-dev jest");
      expect(sanitizeCommand('git commit -m "test message"')).toBe('git commit -m "test message"');
    });

    test("should handle special characters in valid contexts", () => {
      expect(sanitizeCommand('grep "pattern" file.txt')).toBe('grep "pattern" file.txt');
      expect(sanitizeCommand('find . -name "*.ts"')).toBe('find . -name "*.ts"');
    });
  });
});
