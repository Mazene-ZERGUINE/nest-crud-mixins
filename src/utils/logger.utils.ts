import { Logger } from '@nestjs/common';

/**
 * Utility class for logging messages in a structured way.
 * Supports error, warning, and info logs.
 */
export class LoggerUtils {
  private static readonly logger = new Logger('AppLogger');

  /**
   * Logs an informational message.
   * @param message - The message to log.
   * @param context - The optional context (e.g., service name).
   */
  static logInfo(message: string, context?: string): void {
    this.logger.log(`ℹ️ ${message}`, context || 'General');
  }

  /**
   * Logs a warning message.
   * @param message - The warning message.
   * @param context - The optional context (e.g., service name).
   */
  static logWarning(message: string, context?: string): void {
    this.logger.warn(`⚠️ ${message}`, context || 'General');
  }

  /**
   * Logs an error message.
   * @param message - The error message.
   * @param trace - Optional stack trace.
   * @param context - The optional context (e.g., service name).
   */
  static logError(message: string, trace?: any, context?: string): void {
    this.logger.error(`🚨 ${message}`, trace, context || 'General');
  }
}
