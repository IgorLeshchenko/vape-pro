'use strict';

// Node imports:
import mongoose from 'mongoose';
import bluebird from 'bluebird';

// App imports:
import configs from '../../../configs/config.json';
import logger from '../common/logger.service';

// Create the database connection
mongoose.connect(configs.mongoose.uri);
mongoose.Promise = bluebird;

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
    logger.info('Mongoose default connection open to ' + configs.mongoose.uri);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    logger.info('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        logger.info('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

export default mongoose;
