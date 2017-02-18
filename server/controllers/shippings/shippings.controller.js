'use strict';

// Node imports:
import { isUndefined, isNull, extend, pick } from 'lodash';
import sanitize from 'mongo-sanitize';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import ShippingModel from '../../models/shipping.model';

const getDataToUpdate = data => {
    return pick(data, [
        'name', 'description', 'payments', 'isActive'
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

    return ShippingModel.findOne(query)
        .then(shipping => {
            if (shipping) {
                return Promise.reject({ status: 422, message: 'Shipping is not unique' });
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return ShippingModel.findById(itemId)
        .populate('payments', 'id name type')
        .exec()
        .then(shipping => {
            if (!shipping) {
                return Promise.reject({ status: 404, message: 'Failed to find shipping' });
            }

            return shipping.toJSON();
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
        'id', 'name', 'type', 'price', 'isActive', 'payments'
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

    return ShippingModel.count(searchQuery)
        .then(shippingsCount => {
            if (shippingsCount === 0) {
                return {};
            }

            return ShippingModel.find(searchQuery, searchResultFields, searchResultLimits)
                .sort({ [sortBy]: sortOrder })
                .populate('payments', 'id name type')
                .exec()
                .then(shippings => {
                    const pages = Math.floor(shippingsCount / (+size || 0)) || 0;

                    return {
                        items: shippings,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +shippingsCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get shippings list. Message:', error.message);
            return Promise.reject(error);
        });
};

export const create = data => {
    const { name } = data;

    return isUnique({ name })
        .then(() => {
            return extend(new ShippingModel(), getDataToUpdate(data));
        })
        .then(shipping => shipping.save())
        .then(shipping => getById(shipping._id))
        .catch(error => {
            LoggerService.error('Failed to create shipping. Message:', error.message);
            return Promise.reject(error);
        });
};

export const update = (id, data) => {
    const { name } = data;
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return isUnique({ _id: itemId, name })
        .then(() => ShippingModel.findById(itemId))
        .then(shipping => {
            if (!shipping) {
                return Promise.reject({ status: 404, message: 'Failed to find shipping' });
            }

            return extend(shipping, getDataToUpdate(data));
        })
        .then(shipping => shipping.save())
        .then(shipping => getById(shipping._id))
        .catch(error => {
            LoggerService.error('Failed to update shipping. Message:', error.message);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject({ status: 400, message: 'Failed to cast to ObjectId' });
    }

    return ShippingModel.findById(itemId)
        .then(shipping => {
            if (!shipping) {
                return Promise.reject({ status: 404, message: 'Failed to find shipping' });
            }

            return extend(shipping, {
                isDeleted: true
            });
        })
        .then(shipping => shipping.save())
        .catch(error => {
            LoggerService.error('Failed to remove shipping. Message:', error.message);
            return Promise.reject(error);
        });
};
