'use strict';

// Node imports:
import { isUndefined, isNull, extend, pick } from 'lodash';
import sanitize from 'mongo-sanitize';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import ProductModel from '../../models/product.model';

const getDataToUpdate = data => {
    return pick(data, [
        'name', 'type', 'price', 'amountAvailable', 'amountSold', 'gallery', 'characteristics', 'isActive'
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

    return ProductModel.findOne(query)
        .then(product => {
            if (product) {
                return Promise.reject(new Error('Product is not unique'));
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`, { _id }));
    }

    return ProductModel.findById(itemId)
        .populate(`gallery`, `id`)
        .populate(`type`, `id name`)
        .exec()
        .then(product => {
            if (!product) {
                return Promise.reject(new Error('Failed to find product', { _id }));
            }

            return product.toJSON();
        });
};

export const getList = data => {
    const { page = 0, size = 0, sortBy = 'name', sortOrder = 'asc', filters = {} } = data;
    const { query, status, type } = filters;
    const searchQuery = {
        isDeleted: false,
        $or: [{ name: getQueryString(query) }]
    };
    const searchResultFields = [
        `id`, `name`, `type`, `gallery`, `price`, `amountAvailable`, `amountSold`, `isActive`
    ].join(' ');
    let searchResultLimits = {};

    if (!isUndefined(status) && status !== 'all') {
        searchQuery.isActive = sanitize(status);
    }
    if (!isUndefined(type) && type !== 'all') {
        searchQuery.type = sanitize(type);
    }

    if (!isUndefined(size) && size !== 0) {
        const skipTo = parseInt(page, 10) * parseInt(size, 10);
        const limitTo = parseInt(size, 10);

        searchResultLimits = {
            skip: skipTo,
            limit: limitTo
        };
    }

    return ProductModel.count(searchQuery)
        .then(productsCount => {
            if (productsCount === 0) {
                return {};
            }

            return ProductModel.find(searchQuery, searchResultFields, searchResultLimits)
                .sort({ [sortBy]: sortOrder })
                .populate(`gallery`, `id`)
                .populate(`type`, `id name`)
                .exec()
                .then(products => {
                    const pages = Math.floor(productsCount / (+size || 0)) || 0;

                    return {
                        items: products,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +productsCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get products list', error);
            return Promise.reject(error);
        });
};

export const create = data => {
    const { name } = data;

    return isUnique({ name })
        .then(() => {
            return extend(new ProductModel(), getDataToUpdate(data));
        })
        .then(product => product.save())
        .then(product => getById(product._id))
        .catch(error => {
            LoggerService.error('Failed to create product', error);
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
        .then(() => ProductModel.findById(itemId))
        .then(product => {
            if (!product) {
                return Promise.reject(new Error('Failed to find product'));
            }

            return extend(product, getDataToUpdate(data));
        })
        .then(product => product.save())
        .then(product => getById(product._id))
        .catch(error => {
            LoggerService.error('Failed to update product', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return ProductModel.findById(itemId)
        .then(product => {
            if (!product) {
                return Promise.reject(new Error('Failed to find product', { id }));
            }

            return extend(product, {
                isDeleted: true
            });
        })
        .then(product => product.save())
        .catch(error => {
            LoggerService.error('Failed to remove product', error, { id });
            return Promise.reject(error);
        });
};
