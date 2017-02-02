'use strict';

// Node imports:
import { isUndefined, isNull, extend, pick } from 'lodash';
import sanitize from 'mongo-sanitize';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import ProductTypeModel from '../../models/product-type.model';

const getDataToUpdate = data => {
    return pick(data, [
        'name', 'characteristics', 'isActive'
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

    return ProductTypeModel.findOne(query)
        .then(productType => {
            if (productType) {
                return Promise.reject(new Error('Product Type is not unique'));
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`, { _id }));
    }

    return ProductTypeModel.findById(itemId)
        .then(productType => {
            if (!productType) {
                return Promise.reject(new Error('Failed to find product type', { _id }));
            }

            return productType.toJSON();
        });
};

export const getList = data => {
    const { page = 0, size = 0, sortBy = 'name', sortOrder = 'asc', filters = {} } = data;
    const { query, status } = filters;
    const searchQuery = {
        isDeleted: false,
        $or: [{ name: getQueryString(query) }]
    };
    const searchResultFields = [
        `id`, `name`, `characteristics`, `isActive`
    ].join(' ');
    let searchResultLimits = {};

    if (!isUndefined(status) && status !== 'all') {
        searchQuery.isActive = sanitize(status);
    }

    if (!isUndefined(size) && size !== 0) {
        const skipTo = parseInt(page, 10) * parseInt(size, 10);
        const limitTo = parseInt(size, 10);

        searchResultLimits = {
            skip: skipTo,
            limit: limitTo
        };
    }

    return ProductTypeModel.count(searchQuery)
        .then(productsTypeCount => {
            if (productsTypeCount === 0) {
                return {};
            }

            return ProductTypeModel.find(searchQuery, searchResultFields, searchResultLimits)
                .sort({ [sortBy]: sortOrder })
                .exec()
                .then(productsTypes => {
                    const pages = Math.floor(productsTypeCount / (+size || 0)) || 0;

                    return {
                        items: productsTypes,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +productsTypeCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get products types list', error);
            return Promise.reject(error);
        });
};

export const create = data => {
    const { name } = data;

    return isUnique({ name })
        .then(() => {
            return extend(new ProductTypeModel(), getDataToUpdate(data));
        })
        .then(productType => productType.save())
        .then(productType => getById(productType._id))
        .catch(error => {
            LoggerService.error('Failed to create product type', error);
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
        .then(() => ProductTypeModel.findById(itemId))
        .then(productType => {
            if (!productType) {
                return Promise.reject(new Error('Failed to find product type'));
            }

            return extend(productType, getDataToUpdate(data));
        })
        .then(productType => productType.save())
        .then(productType => getById(productType._id))
        .catch(error => {
            LoggerService.error('Failed to update product type', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return ProductTypeModel.findById(itemId)
        .then(productType => {
            if (!productType) {
                return Promise.reject(new Error('Failed to find product type', { id }));
            }

            return extend(productType, {
                isDeleted: true
            });
        })
        .then(productType => productType.save())
        .catch(error => {
            LoggerService.error('Failed to remove product type', error, { id });
            return Promise.reject(error);
        });
};
