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
  if (!inputPath || typeof inputPath !== 'string' || inputPath.trim() === '') {
    // Allow empty paths to default to current directory within allowed path
    inputPath = '.';
  }

  try {
    // Normalize and resolve the paths
    const normalizedInput = normalize(inputPath);
    const resolvedAllowed = resolve(allowedBasePath);
    const resolvedInput = resolve(resolvedAllowed, normalizedInput);
    
    // Ensure the allowed path ends with a separator for proper comparison
    const allowedWithSeparator = resolvedAllowed + (resolvedAllowed.endsWith('/') ? '' : '/');
    const inputWithSeparator = resolvedInput + (resolvedInput.endsWith('/') ? '' : '/');
    
    // Check if the resolved path is within the allowed directory
    // Must either be exactly the allowed path or start with allowedPath + separator
    if (resolvedInput !== resolvedAllowed && !inputWithSeparator.startsWith(allowedWithSeparator)) {
      throw new Error('Path traversal attempt detected - path must be within allowed directory');
    }
    
    return resolvedInput;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown path validation error';
    throw new Error(`Invalid path: ${errorMessage}`);
  }
} 