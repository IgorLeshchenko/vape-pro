'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    name: { type: String },
    type: { type: String, enum: [`cash`, `card`], default: 'cash' },

    description: { type: String },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
};

export default mongoose.model('Payment', addSchemaHandlers(schema));
