import { format, createLogger, transports } from 'winston';
const { combine, timestamp, prettyPrint } = format;

export const logger = createLogger({
  levels: { error: 0, info: 1 },
  format: combine(
    timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    prettyPrint(),
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({
      filename: `${process.cwd()}/src/logs/info.log`,
      level: 'info',
    }),
    new transports.Console({ level: 'error' }),
    new transports.File({
      filename: `${process.cwd()}/src/logs/error.log`,
      level: 'error',
    }),
  ],
});
