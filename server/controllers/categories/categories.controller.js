`use strict`;

// Node imports:
import sanitize from 'mongo-sanitize';
import { ObjectId } from 'mongodb';
import { isUndefined, isEmpty, isNull, extend } from 'lodash';

// App imports:
import LoggerService from '../../services/common/logger.service';
import CategoryModel from '../../models/category.model';
import ImgModel from '../../models/img.model';
import DirectoryModel from '../../models/directory.model';

const createObjectId = id => {
    let itemId = null;

    try {
        itemId = new ObjectId(sanitize(id));
    } catch(error) {};

    return itemId
};

const isUnique = ({ _id, name, directory = {} }) => {
    const query = { name: name, directory: directory._id };

    if (!isUndefined(_id)) {
        query._id = { $ne: _id };
    }

    if (!name || !directory) {
        return Promise.resolve(true);
    }

    return CategoryModel.findOne(query)
        .then((category) => {
            if (!isEmpty(category)) {
                return Promise.reject(new Error('Category is not unique'));
            }

            return true;
        });
};

const get = query => {
    return CategoryModel
        .findOne(query)
        .populate('picture', 'id')
        .populate('directory', 'id name')
        .exec()
        .then(category => {
            if (!category) {
                return Promise.reject(new Error('Failed to find category', { query }))
            }

            return category || {};
        })
        .catch((error) => {
            LoggerService.error('Failed to get category', error);
            return Promise.reject(error);
        });
};

export const getById = _id => {
    const itemId = createObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return get({ _id: new ObjectId(sanitize(_id)) })
        .then(category => category ? category.toJSON() : {});
};

export const getByPath = path => {
    return get({ path: sanitize(path) })
        .then(category => category ? category.toJSON() : {});
};

export const create = data => {
    const { name, directory } = data;
    const ItemToCreate = new CategoryModel(data);

    return isUnique({ name, directory })
        .then(() => ItemToCreate.save())
        .then(category => getById(category._id))
        .catch(error => {
            LoggerService.error('Failed to create category', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = createObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return CategoryModel.findById(itemId)
        .then(category => {
            if (!category) {
                return Promise.reject(new Error('Failed to find category'))
            }

            return extend(category, { isDeleted: true });
        })
        .then(category => category.save())
        .catch(error => {
            LoggerService.error('Failed to remove category', error, { itemId });
            return Promise.reject(error);
        });
};
