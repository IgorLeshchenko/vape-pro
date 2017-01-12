'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    name: { type: String, index: { unique: true } },
    path: { type: String, index: { unique: true } },
    index: { type: Number, default: 10 },

    picture: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Img'
    },

    description: String,
    country: String,
    website: String,

    seoDescription: { type: String, default: '' },
    seoKeywords: { type: String, default: '' },

    isActive: { type: Boolean, default: true },
    isDeleted:  { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

export default mongoose.model('Manufacturer', addSchemaHandlers(schema));
