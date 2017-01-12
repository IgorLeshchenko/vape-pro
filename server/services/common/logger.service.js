'use strict';

// Node imports:
import path from 'path';
import winston from 'winston';

winston.emitErrs = true;

const logger = (module) => {
    return new winston.Logger({
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
                label: getFilePath(module),
                handleException: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });
};

// using filename in log statements
const getFilePath = (module) => {
    return module.filename.split(path.sep).slice(-2).join(path.sep);
};

export default logger;
