'use strict';

// Node imports:
import { isUndefined, isNull, extend, pick } from 'lodash';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import CategoryModel from '../../models/category.model';

const getDataToUpdate = data => {
    return pick(data, [
        'name', 'path', 'index', 'directory', 'picture', 'description', 'seoKeywords', 'seoDescription', 'isActive'
    ]);
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
        .then(category => {
            if (category) {
                return Promise.reject(new Error('Category is not unique'));
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return CategoryModel.findById(itemId)
        .populate('picture', 'id')
        .populate('directory', 'id name')
        .exec()
        .then(category => {
            if (!category) {
                return Promise.reject(new Error('Failed to find category', { _id }));
            }

            return category.toJSON();
        });
};

export const getByPath = path => {
    return CategoryModel.findOne({ path })
        .populate('picture', 'id')
        .populate('directory', 'id name')
        .exec()
        .then(category => {
            if (!category) {
                return Promise.reject(new Error('Failed to find category', { path }));
            }

            return category.toJSON();
        });
};

export const getList = data => {
    const { page = 0, size = 0, sortBy = 'index', sortOrder = 'desc', filters = {} } = data;
    const { query, status, directory } = filters;
    const searchQuery = {
        isDeleted: false,
        $or: [{ name: getQueryString(query) }]
    };
    const searchResultFields = [
        'id', 'name', 'path', 'index', 'picture', 'directory', 'isActive'
    ].join(' ');
    let searchResultLimits = {};

    if (!isUndefined(status) && status !== 'all') {
        searchQuery.isActive = status;
    }

    if (!isUndefined(directory) && directory !== 'all') {
        searchQuery.directory = directory;
    }

    if (!isUndefined(size) && size !== 0) {
        const skipTo = parseInt(page, 10) * parseInt(size, 10);
        const limitTo = parseInt(size, 10);

        searchResultLimits = {
            skip: skipTo,
            limit: limitTo
        };
    }

    return CategoryModel.count(searchQuery)
        .then(categoriesCount => {
            if (categoriesCount === 0) {
                return {};
            }

            return CategoryModel.find(searchQuery, searchResultFields, searchResultLimits)
                .sort({ [sortBy]: sortOrder })
                .populate('picture', 'id')
                .populate('directory', 'id name')
                .exec()
                .then(categories => {
                    const pages = Math.floor(categoriesCount / (+size || 0)) || 0;

                    return {
                        items: categories,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +categoriesCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get categories list', error);
            return Promise.reject(error);
        });
};

export const create = data => {
    const { name, directory } = data;

    return isUnique({ name, directory })
        .then(() => {
            return extend(new CategoryModel(), getDataToUpdate(data));
        })
        .then(category => category.save())
        .then(category => getById(category._id))
        .catch(error => {
            LoggerService.error('Failed to create category', error);
            return Promise.reject(error);
        });
};

export const update = (id, data) => {
    const { name, directory } = data;
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return isUnique({ _id: itemId, name, directory })
        .then(() => CategoryModel.findById(itemId))
        .then(category => {
            if (!category) {
                return Promise.reject(new Error('Failed to find category'));
            }

            return extend(category, getDataToUpdate(data));
        })
        .then(category => category.save())
        .then(category => getById(category._id))
        .catch(error => {
            LoggerService.error('Failed to update category', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return CategoryModel.findById(itemId)
        .then(category => {
            if (!category) {
                return Promise.reject(new Error('Failed to find category', { id }));
            }

            return extend(category, {
                isDeleted: true
            });
        })
        .then(category => category.save())
        .catch(error => {
            LoggerService.error('Failed to remove category', error, { itemId });
            return Promise.reject(error);
        });
};
