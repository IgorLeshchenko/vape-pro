'use strict';

// Node imports:
import { isUndefined, isNull, extend, pick } from 'lodash';
import sanitize from 'mongo-sanitize';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import ManufacturerModel from '../../models/manufacturer.model';

const getDataToUpdate = data => {
    return pick(data, [
        'name', 'path', 'index', 'picture', 'country', 'website', 'description', 'seoKeywords', 'seoDescription', 
        'isActive'
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

    return ManufacturerModel.findOne(query)
        .then(manufacturer => {
            if (manufacturer) {
                return Promise.reject(new Error('Manufacturer is not unique'));
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return ManufacturerModel.findById(itemId)
        .then(manufacturer => {
            if (!manufacturer) {
                return Promise.reject(new Error('Failed to find manufacturer', { _id }));
            }

            return manufacturer.toJSON();
        });
};

export const getByPath = path => {
    const safePath = sanitize(path);

    return ManufacturerModel.findOne({ path: safePath })
        .then(manufacturer => {
            if (!manufacturer) {
                return Promise.reject(new Error('Failed to find manufacturer', { path }));
            }

            return manufacturer.toJSON();
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
        'id', 'name', 'path', 'index', 'picture', 'isActive'
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

    return ManufacturerModel.count(searchQuery)
        .then(manufacturersCount => {
            if (manufacturersCount === 0) {
                return {};
            }

            return ManufacturerModel.find(searchQuery, searchResultFields, searchResultLimits)
                .sort({ [sortBy]: sortOrder })
                .exec()
                .then(manufacturers => {
                    const pages = Math.floor(manufacturersCount / (+size || 0)) || 0;

                    return {
                        items: manufacturers,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +manufacturersCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get manufacturers list', error);
            return Promise.reject(error);
        });
};

export const create = data => {
    const { name } = data;

    return isUnique({ name })
        .then(() => {
            return extend(new ManufacturerModel(), getDataToUpdate(data));
        })
        .then(manufacturer => manufacturer.save())
        .then(manufacturer => getById(manufacturer._id))
        .catch(error => {
            LoggerService.error('Failed to create manufacturer', error);
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
        .then(() => ManufacturerModel.findById(itemId))
        .then(manufacturer => {
            if (!manufacturer) {
                return Promise.reject(new Error('Failed to find manufacturer'));
            }

            return extend(manufacturer, getDataToUpdate(data));
        })
        .then(manufacturer => manufacturer.save())
        .then(manufacturer => getById(manufacturer._id))
        .catch(error => {
            LoggerService.error('Failed to update manufacturer', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return ManufacturerModel.findById(itemId)
        .then(manufacturer => {
            if (!manufacturer) {
                return Promise.reject(new Error('Failed to find manufacturer', { id }));
            }

            return extend(manufacturer, {
                isDeleted: true
            });
        })
        .then(manufacturer => manufacturer.save())
        .catch(error => {
            LoggerService.error('Failed to remove manufacturer', error, { id });
            return Promise.reject(error);
        });
};
