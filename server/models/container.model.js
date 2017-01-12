'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    name: { type: String },
    path: { type: String },
    index: { type: Number, default: 10 },

    isNewComing: { type: Boolean, default: false },
    isNewSeller: { type: Boolean, default: false },
    isTopSeller: { type: Boolean, default: false },

    type: {
        type: mongoose.Schema.Types.ObjectId, ref: `ProductType`
    },

    directory: {
        type: mongoose.Schema.Types.ObjectId, ref: `Directory`
    },

    category: {
        type: mongoose.Schema.Types.ObjectId, ref: `Category`
    },

    manufacturer: {
        type: mongoose.Schema.Types.ObjectId, ref: `Manufacturer`
    },

    picture: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Img'
    },

    productsName: { type: String },
    productsValueType: { type: String, enum: [`color`, `text`], default: 'text' },

    products: [
        new mongoose.Schema({
            product: {
                type: mongoose.Schema.Types.ObjectId, ref: `Category`
            },
            name: { type: String }
        })
    ],

    content: [
        new mongoose.Schema({
            name: { type: String },
            amount: { type: Number, default: 1 }
        })
    ],

    comments: [{
        type: mongoose.Schema.Types.ObjectId, ref: `Comment`
    }],

    reviews: [{
        type: mongoose.Schema.Types.ObjectId, ref: `Review`
    }],

    description: { type: String },
    video: { type: String },

    seoKeywords: { type: String },
    seoDescription: { type: String },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

export default mongoose.model('Container', addSchemaHandlers(schema));
