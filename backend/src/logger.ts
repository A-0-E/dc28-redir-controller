import { format, transports, createLogger } from 'winston';
import { logLevel } from './environ';

export const logRoot = createLogger({
    level: logLevel,
    transports: new transports.Console(),
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.simple(),
    ),
})