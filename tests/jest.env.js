/**
 * Jest environment setup (JavaScript)
 * Set environment variables for testing
 */

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.ALLOWED_PATH = '/tmp';
process.env.ALLOWED_COMMANDS = 'npm,git,ls,cat,pwd,node';
process.env.MAX_COMMAND_LENGTH = '1000';
process.env.COMMAND_TIMEOUT = '30000';
process.env.MAX_CONCURRENT_COMMANDS = '3';
process.env.MAX_OUTPUT_SIZE = '10485760';

// Load configuration after setting environment variables
const { loadConfig } = require('../src/config/config-loader');
loadConfig(); 