'use strict';

// Node imports:
import mongoose from 'mongoose';
import { hashSync, compareSync, genSaltSync } from 'bcrypt-nodejs';

// App imports:
import addSchemaHandlers from './_schema.handlers';

export const schema = {
    email: { type: String, index: { unique: true } },
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    role: {
        type: String, required: true, enum: ['customer', 'admin', 'supplier'], default: 'customer'
    },
    picture: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Img'
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

const userSchemaWithHandlers = addSchemaHandlers(schema);

userSchemaWithHandlers.pre('save', function(next) {
    const user = this;
    const password = user.password;

    if (!user.isModified('password')) {
        return next();
    }

    user.password = hashSync(password, genSaltSync(8), null);
    next();
});

userSchemaWithHandlers.methods.generateHash = function (password) {
    return hashSync(password, genSaltSync(8), null);
};

userSchemaWithHandlers.methods.validPassword = function (password) {
    return compareSync(password, this.password);
};

export default mongoose.model('User', userSchemaWithHandlers);
