'use strict';

// Node imports:
import winston from 'winston';

winston.emitErrs = true;

export default new winston.Logger({
    transports: [
        new winston.transports.File({
            level: `info`,
            filename: `logs/all.log`,
            handleException: true,
            json: true,
            maxSize: 5242880, // 5mb
            maxFiles: 2,
            colorize: false
        }),

        new winston.transports.Console({
            level: `debug`,
            handleException: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});
