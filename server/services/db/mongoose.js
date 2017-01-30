'use strict';

// Node imports:
import mongoose from 'mongoose';
import bluebird from 'bluebird';

// App imports:
import configs from '../../../configs/config.json';
import logger from '../common/logger.service';

mongoose.connect(configs.mongoose.uri);
mongoose.Promise = bluebird;

mongoose.connection.on('connected', () => {
    logger.info('Mongoose default connection open to ' + configs.mongoose.uri);
});

mongoose.connection.on('error', err => {
    logger.info('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

export default mongoose;
