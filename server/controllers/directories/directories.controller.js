'use strict';

// Node imports:
import { isUndefined, isNull, extend, pick } from 'lodash';
import sanitize from 'mongo-sanitize';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import DirectoryModel from '../../models/directory.model';

const getDataToUpdate = data => {
    return pick(data, [
        'name', 'path', 'index', 'isActive', 'seoKeywords', 'seoDescription'
    ]);
};

const isUnique = ({ _id, name }) => {
    const query = { name: name };

    if (!isUndefined(_id)) {
        query._id = { $ne: _id };
    }

    if (!name) {
        return Promise.resolve(true);
    }

    return DirectoryModel.findOne(query)
        .then(directory => {
            if (directory) {
                return Promise.reject(new Error('Directory is not unique'));
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return DirectoryModel.findById(itemId)
        .then(directory => {
            if (!directory) {
                return Promise.reject(new Error('Failed to find directory', { _id }));
            }

            return directory.toJSON();
        });
};

export const getByPath = path => {
    const safePath = sanitize(path);

    return DirectoryModel.findOne({ path: safePath })
        .then(directory => {
            if (!directory) {
                return Promise.reject(new Error('Failed to find directory', { path }));
            }

            return directory.toJSON();
        });
};

export const getList = data => {
    const { page = 0, size = 0, sortBy = 'index', sortOrder = 'desc', filters = {} } = data;
    const { query, status } = filters;
    const searchQuery = {
        isDeleted: false,
        $or: [{ name: getQueryString(query) }]
    };
    const searchResultFields = [
        'id', 'name', 'path', 'index', 'isActive', 'seoDescription', 'seoKeywords'
    ].join(' ');
    let searchResultLimits = {};

    if (!isUndefined(status) && status !== 'all') {
        searchQuery.isActive = status;
    }

    if (!isUndefined(size) && size !== 0) {
        const skipTo = parseInt(page, 10) * parseInt(size, 10);
        const limitTo = parseInt(size, 10);

        searchResultLimits = {
            skip: skipTo,
            limit: limitTo
        };
    }

    return DirectoryModel.count(searchQuery)
        .then(directoriesCount => {
            if (directoriesCount === 0) {
                return {};
            }

            return DirectoryModel.find(searchQuery, searchResultFields, searchResultLimits)
                .sort({ [sortBy]: sortOrder })
                .exec()
                .then(directories => {
                    const pages = Math.floor(directoriesCount / (+size || 0)) || 0;

                    return {
                        items: directories,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +directoriesCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get directories list', error);
            return Promise.reject(error);
        });
};

export const create = data => {
    const { name } = data;

    return isUnique({ name })
        .then(() => {
            return extend(new DirectoryModel(), getDataToUpdate(data));
        })
        .then(directory => directory.save())
        .then(directory => getById(directory._id))
        .catch(error => {
            LoggerService.error('Failed to create directory', error);
            return Promise.reject(error);
        });
};

export const update = (id, data) => {
    const { name } = data;
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return isUnique({ _id: itemId, name })
        .then(() => DirectoryModel.findById(itemId))
        .then(directory => {
            if (!directory) {
                return Promise.reject(new Error('Failed to find directory'));
            }

            return extend(directory, getDataToUpdate(data));
        })
        .then(directory => directory.save())
        .then(directory => getById(directory._id))
        .catch(error => {
            LoggerService.error('Failed to update directory', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return DirectoryModel.findById(itemId)
        .then(directory => {
            if (!directory) {
                return Promise.reject(new Error('Failed to find directory', { id }));
            }

            return extend(directory, {
                isDeleted: true
            });
        })
        .then(directory => directory.save())
        .catch(error => {
            LoggerService.error('Failed to remove directory', error, { itemId });
            return Promise.reject(error);
        });
};
