import { format, createLogger, transports } from 'winston';
const { combine, timestamp, prettyPrint } = format;

export const logger = createLogger({
  levels: { error: 0, info: 2 },
  format: combine(
    timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    prettyPrint(),
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({
      filename: `${process.cwd()}/src/logs/combined.log`,
      level: 'info',
    }),
    new transports.File({
      filename: `${process.cwd()}/src/logs/error.log`,
      level: 'error',
    }),
  ],
});
