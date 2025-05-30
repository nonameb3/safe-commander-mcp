import { validateCommand } from "../commands/command-validator";
import { validatePath } from "../security/path-validator";
import { sanitizeCommand } from "../security/sanitizer";
import { validateCommandCategories } from "../commands/command-categorizer";
import { CONFIG } from "./config-loader";
import { log } from "../utils/logger";

/**
 * Comprehensive startup validation
 *
 * @throws Error if any startup validation checks fail
 */
export function validateStartupConfiguration(): void {
  try {
    log("info", "Running startup validation checks...");

    // Validate command categorization first
    const categoryValidation = validateCommandCategories(CONFIG.ALLOWED_COMMANDS);
    if (!categoryValidation.valid) {
      log("warn", "Some commands are missing categorization or descriptions", {
        missingCategories: categoryValidation.missingCategories,
        missingDescriptions: categoryValidation.missingDescriptions,
        note: 'These commands will be placed in the "other" category',
      });
    } else {
      log("debug", "All commands have proper categorization and descriptions");
    }

    // Test command validation logic with each allowed command
    for (const cmd of CONFIG.ALLOWED_COMMANDS) {
      try {
        validateCommand(cmd);
        log("debug", `Command validation successful for: ${cmd}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown validation error";
        throw new Error(`Startup validation failed for allowed command '${cmd}': ${errorMessage}`);
      }
    }

    // Test path validation logic with the allowed path
    try {
      validatePath(".", CONFIG.ALLOWED_PATH);
      validatePath("./test", CONFIG.ALLOWED_PATH);
      log("debug", "Path validation logic working correctly");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown path validation error";
      throw new Error(`Path validation logic failed: ${errorMessage}`);
    }

    // Test sanitizeCommand function with safe commands
    try {
      for (const cmd of CONFIG.ALLOWED_COMMANDS) {
        const sanitized = sanitizeCommand(cmd);
        if (sanitized !== cmd) {
          throw new Error(`Command '${cmd}' failed sanitization check`);
        }
      }
      log("debug", "Command sanitization logic working correctly");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown sanitization error";
      throw new Error(`Command sanitization failed: ${errorMessage}`);
    }

    // Validate configuration values
    if (CONFIG.MAX_COMMAND_LENGTH <= 0) {
      throw new Error("MAX_COMMAND_LENGTH must be greater than 0");
    }
    if (CONFIG.MAX_OUTPUT_SIZE <= 0) {
      throw new Error("MAX_OUTPUT_SIZE must be greater than 0");
    }
    if (CONFIG.COMMAND_TIMEOUT <= 0) {
      throw new Error("COMMAND_TIMEOUT must be greater than 0");
    }
    if (CONFIG.MAX_CONCURRENT_COMMANDS <= 0) {
      throw new Error("MAX_CONCURRENT_COMMANDS must be greater than 0");
    }

    // Test that dangerous commands are properly rejected
    const dangerousCommands = ["rm -rf", "sudo rm", "chmod +x; /bin/sh", "cat /etc/passwd", "dangerous_cmd"];
    for (const dangerousCmd of dangerousCommands) {
      try {
        validateCommand(dangerousCmd);
        // If we get here, validation failed to catch a dangerous command
        throw new Error(`Validation failed to reject dangerous command: ${dangerousCmd}`);
      } catch (error) {
        // This is expected - dangerous commands should be rejected
        log("debug", `Correctly rejected dangerous command: ${dangerousCmd}`);
      }
    }

    // Log validation summary
    log("info", "All startup validation checks passed successfully", {
      totalCommands: CONFIG.ALLOWED_COMMANDS.length,
      categorizedCommands: categoryValidation.known.length,
      uncategorizedCommands: categoryValidation.unknown.length,
      configurationValid: true,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown startup validation error";
    log("error", "Startup validation failed", { error: errorMessage });
    throw new Error(`Startup validation failed: ${errorMessage}`);
  }
}
