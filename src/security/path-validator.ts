import { resolve, normalize } from "node:path";

/**
 * Security: Path traversal prevention
 * 
 * @param inputPath - The input path to validate
 * @param allowedBasePath - The allowed base directory path
 * @returns The validated and resolved path
 * @throws Error if path traversal is detected or path is invalid
 */
export function validatePath(inputPath: string, allowedBasePath: string): string {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('Path must be a non-empty string');
  }

  try {
    // Normalize and resolve the paths
    const normalizedInput = normalize(inputPath);
    const resolvedAllowed = resolve(allowedBasePath);
    const resolvedInput = resolve(resolvedAllowed, normalizedInput);
    
    // Check if the resolved path is within the allowed directory
    if (!resolvedInput.startsWith(resolvedAllowed)) {
      throw new Error('Path traversal attempt detected - path must be within allowed directory');
    }
    
    return resolvedInput;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown path validation error';
    throw new Error(`Invalid path: ${errorMessage}`);
  }
} 