'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    name: { type: String },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductType' },

    gallery: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Img'
    }],

    price: { type: Number, required: true, default: 0 },

    amountAvailable: { type: Number, default: 0 },
    amountSold: { type: Number, default: 0 },
    amountBought: { type: Number, default: 0 },

    characteristics: [
        new mongoose.Schema({
            name: { type: String, default: '' },
            type: {
                type: String, enum: ['text', 'number', 'boolean'], default: 'text'
            },
            value: { type: mongoose.Schema.Types.Mixed, default: '' },
            unit: { type: String, default: '' },
            isRequired: { type: Boolean, default: false }
        })
    ],

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

export default mongoose.model('Product', addSchemaHandlers(schema));
