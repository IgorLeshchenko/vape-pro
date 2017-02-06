'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    mark: {
        type: Number, default: 5, enum: [1, 2, 3, 4, 5]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

export default mongoose.model('Review', addSchemaHandlers(schema));
