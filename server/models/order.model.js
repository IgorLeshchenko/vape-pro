'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    status: {
        type: String, required: true, enum: [ 'new', 'approved', 'received', 'declined' ], default: 'new'
    },

    customerFirstName: { type: String, default: '' },
    customerLastName: { type: String, default: '' },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, default: '' },
    customerComment: { type: String, default: '' },

    shippingTracking: { type: String, default: '' },
    shippingPrice: { type: Number, default: 0 },
    shippingCity: { type: String, default: '' },
    shippingStreet: { type: String, default: '' },
    shippingHouse: { type: String, default: '' },
    shippingPostOffice: { type: String, default: '' },

    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },

    shippingType: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Shipping'
    },

    paymentType: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Payment'
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

    comments: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Comment'
    }],

    isDeleted: { type: Boolean, default: false },

    approvedAt: { type: Date },
    receivedAt: { type: Date },
    declinedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

export default mongoose.model('Order', addSchemaHandlers(schema));
