'use strict';

// Node imports:
import mongoose from 'mongoose';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    name: { type: String },
    path: { type: String },
    index: { type: Number, default: 10 },
    directory: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Directory'
    },
    picture: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Img'
    },
    description: { type: String },
    seoKeywords: { type: String },
    seoDescription: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

export default mongoose.model('Category', addSchemaHandlers(schema));
