import { getRunningCommands } from '../security/rate-limiter.js';
import { log } from './logger.js';

/**
 * Graceful shutdown with proper cleanup
 * Sets up signal handlers for SIGINT and SIGTERM
 */
export function setupGracefulShutdown(): void {
  const shutdown = (signal: string) => {
    log('info', `Received ${signal}, initiating graceful shutdown...`);
    
    // Set a timeout for forced shutdown
    const shutdownTimeout = setTimeout(() => {
      log('warn', 'Shutdown timeout reached, forcing exit');
      process.exit(1);
    }, 5000);

    const runningCommands = getRunningCommands();
    if (runningCommands.size === 0) {
      clearTimeout(shutdownTimeout);
      log('info', 'Shutdown complete - no running commands');
      process.exit(0);
    } else {
      log('info', `Waiting for ${runningCommands.size} running commands to complete...`);
      const checkInterval = setInterval(() => {
        const currentRunningCommands = getRunningCommands();
        if (currentRunningCommands.size === 0) {
          clearInterval(checkInterval);
          clearTimeout(shutdownTimeout);
          log('info', 'Shutdown complete - all commands finished');
          process.exit(0);
        }
      }, 100);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
} 