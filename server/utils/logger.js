const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '..', 'logs');
    this.isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    // Only create logs directory in non-serverless environments
    if (!this.isServerless) {
      this.ensureLogsDirectory();
    }
  }

  ensureLogsDirectory() {
    try {
      if (!fs.existsSync(this.logsDir)) {
        fs.mkdirSync(this.logsDir, { recursive: true });
      }
    } catch (error) {
      console.warn('Could not create logs directory:', error.message);
      this.isServerless = true; // Fallback to serverless mode
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  getLogFileName() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `debug-${year}-${month}-${day}.log`;
  }

  log(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      data: data ? JSON.stringify(data, null, 2) : null,
      pid: process.pid
    };

    // Console log (always available)
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
    if (data) {
      console.log('Data:', data);
    }

    // File log (only in non-serverless environments)
    if (!this.isServerless) {
      const logLine = `[${timestamp}] ${level.toUpperCase()}: ${message}${data ? '\nData: ' + JSON.stringify(data, null, 2) : ''}\n`;
      const logFile = path.join(this.logsDir, this.getLogFileName());
      
      try {
        fs.appendFileSync(logFile, logLine);
      } catch (error) {
        console.error('Failed to write to log file:', error.message);
      }
    }
  }

  info(message, data = null) {
    this.log('info', message, data);
  }

  error(message, data = null) {
    this.log('error', message, data);
  }

  warn(message, data = null) {
    this.log('warn', message, data);
  }

  debug(message, data = null) {
    this.log('debug', message, data);
  }

  email(message, data = null) {
    this.log('email', message, data);
  }
}

module.exports = new Logger();
