import { format, transports, createLogger } from 'winston';

export const logRoot = createLogger({
    level: 'debug',
    transports: new transports.Console(),
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.simple(),
    ),
})