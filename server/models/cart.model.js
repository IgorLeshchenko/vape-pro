'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    session: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: `User` },
    products: [
        new mongoose.Schema({
            amount: { type: Number, default: 0 },
            container: { type: mongoose.Schema.Types.ObjectId, ref: `Container` },
            product: { type: mongoose.Schema.Types.ObjectId, ref: `Product` },
        })
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

export default mongoose.model('Cart', addSchemaHandlers(schema));
