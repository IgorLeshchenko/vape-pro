`use strict`;

// Node imports:
import sanitize from 'mongo-sanitize';
import { ObjectId } from 'mongodb';

export const getQueryString = q => {
    let searchRegEx;

    try {
        searchRegEx = new RegExp(sanitize(q) || ``, `gi`);
    } catch (e) {
        searchRegEx = new RegExp(sanitize(escape(q)), `gi`);
    }

    return searchRegEx
};

export const castToObjectId = id => {
    let itemId = null;

    try {
        itemId = new ObjectId(sanitize(id));
    } catch(error) {};

    return itemId
};
