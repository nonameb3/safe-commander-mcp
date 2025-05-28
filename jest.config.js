/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest for TypeScript files
  preset: 'ts-jest',
  
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/src/**/*.test.ts'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/index.ts' // Skip entry point
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Environment variables for tests
  setupFiles: ['<rootDir>/tests/jest.env.js']
}; 