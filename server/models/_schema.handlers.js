'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import Logger from '../services/common/logger.service';

const schemaOptions = {
    toJSON: {
        virtuals: true
    }
};

export default (schema) => {
    const instance = new mongoose.Schema(schema, schemaOptions)

    instance.pre('update', function() {
        this.update({},{ $set: { updatedAt: new Date() } });
    });

    instance.pre('find', function() {
        this.start = Date.now();
    });

    instance.post('find', function() {
        Logger.info('find() took ' + (Date.now() - this.start) + ' millis');
    });

    instance.virtual(`id`).get(function() {
        return this._id;
    });

    return instance;
};
