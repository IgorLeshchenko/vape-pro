'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    status: {
        type: String, required: true, enum: ['new', 'shipped', 'received', 'declined'], default: 'new'
    },

    products: [
        new mongoose.Schema({
            product: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Product'
            },
            container: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Container'
            },
            amount: { type: Number, default: 0 },
            price: { type: Number, default: 0 }
        })
    ],

    shippingTracking: { type: String },
    shippingPrice: { type: Number, default: 0 },
    customsPrice: { type: Number, default: 0 },

    isDeleted: { type: Boolean, default: false },

    shippedAt: { type: Date, default: Date.now },
    receivedAt: { type: Date, default: Date.now },
    declinedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

export default mongoose.model('Supply', addSchemaHandlers(schema));
