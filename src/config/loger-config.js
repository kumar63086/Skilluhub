const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format; // colorize destructure చేయడం

// Custom format
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} : ${level}: ${message}`;
});

// Logger definition
const logger = createLogger({
  format: combine(
    colorize(), // just use colorize() instead of winston.format.colorize()
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    myFormat
  ),
  transports: [
    new transports.Console(), // Console log
    new transports.File({ filename: 'combined.log'}) // Only errors saved to file
  ]
});

// Export
module.exports = {
  logger
};
