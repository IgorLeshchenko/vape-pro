'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    name: { type: String },
    type: { type: String, enum: [`postOffice`, `customer`, `shop`], default: 'customer' },

    price: { type: Number, default: 0 },

    payments: [{
        type: mongoose.Schema.Types.ObjectId, ref: `Payment`
    }],

    description: { type: String },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
};

export default mongoose.model('Shipping', addSchemaHandlers(schema));
