import winston from 'winston';
import 'winston-mongodb';

const { combine, printf, timestamp, metadata } = winston.format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] -> ${level}: ${message}${stack ? `\n${stack}` : ''}`;
});

/**
 * @description
 * This is a logger module, which is used to log errors to a file and console.
 * @example
 * import { logger } from '@kamal-sha/common-utils';
 *
 * logger.info("this is an info");
 * logger.warn("this is a warning");
 * logger.debug("this is a debug");
 * logger.success("this is a success");
 * logger.error("this is an error");
 */
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    myFormat
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

/**
 * @description
 * This function is used to add MongoDB transport to the logger.
 * @param {string} dbUrl - The MongoDB connection string.
 * @param {object} logger - The Winston logger instance.
 * @param {string} [collection='error_log'] - The MongoDB collection name.
 * @example
 * import { addMongoDBTransport, logger } from '@kamal-sha/common-utils';
 *
 * addMongoDBTransport("mongodb://localhost:27017/test", logger);
 * @example
 * import { addMongoDBTransport, logger } from '@kamal-sha/common-utils';
 *
 * addMongoDBTransport("mongodb://localhost:27017/test", logger, "error_log");
 */
const addMongoDBTransport = (dbUrl, logger, collection = 'error_log') => {
  logger.add(
    new winston.transports.MongoDB({
      db: dbUrl,
      collection: collection,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      level: 'error',
      format: metadata(),
    })
  );
};

export { logger, addMongoDBTransport };
