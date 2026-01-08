// src/utils/logger.ts
import fs from 'fs';
import path from 'path';

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

class Logger {
  private logDir = path.join(process.cwd(), 'logs');

  constructor() {
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}\n`;
  }

  private writeToFile(level: LogLevel, message: string): void {
    const date = new Date().toISOString().split('T')[0];
    const filename = path.join(this.logDir, `${date}.log`);
    fs.appendFileSync(filename, message);
  }

  info(message: string, meta?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.INFO, message, meta);
    console.log(`\x1b[36m${formattedMessage}\x1b[0m`);
    this.writeToFile(LogLevel.INFO, formattedMessage);
  }

  warn(message: string, meta?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.WARN, message, meta);
    console.warn(`\x1b[33m${formattedMessage}\x1b[0m`);
    this.writeToFile(LogLevel.WARN, formattedMessage);
  }

  error(message: string, meta?: any): void {
    const formattedMessage = this.formatMessage(LogLevel.ERROR, message, meta);
    console.error(`\x1b[31m${formattedMessage}\x1b[0m`);
    this.writeToFile(LogLevel.ERROR, formattedMessage);
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, meta);
      console.log(`\x1b[35m${formattedMessage}\x1b[0m`);
      this.writeToFile(LogLevel.DEBUG, formattedMessage);
    }
  }
}

export default new Logger();
