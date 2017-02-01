'use strict';

// Node imports:
import { isUndefined, isNull, extend, pick } from 'lodash';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import PaymentModel from '../../models/payment.model';

const getDataToUpdate = data => {
    return pick(data, [
        'name', 'type', 'description', 'isActive'
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

    return PaymentModel.findOne(query)
        .then(payment => {
            if (payment) {
                return Promise.reject(new Error('Payment name is not unique'));
            }

            return true;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`, { _id }));
    }

    return PaymentModel.findById(itemId)
        .then(payment => {
            if (!payment) {
                return Promise.reject(new Error('Failed to find payment', { _id }));
            }

            return payment.toJSON();
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
        'id', 'name', 'type', 'isActive'
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

    return PaymentModel.count(searchQuery)
        .then(paymentsCount => {
            if (paymentsCount === 0) {
                return {};
            }

            return PaymentModel.find(searchQuery, searchResultFields, searchResultLimits)
                .sort({ [sortBy]: sortOrder })
                .exec()
                .then(payments => {
                    const pages = Math.floor(paymentsCount / (+size || 0)) || 0;

                    return {
                        items: payments,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +paymentsCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get payments list', error);
            return Promise.reject(error);
        });
};

export const create = data => {
    const { name } = data;

    return isUnique({ name })
        .then(() => {
            return extend(new PaymentModel(), getDataToUpdate(data));
        })
        .then(payment => payment.save())
        .then(payment => getById(payment._id))
        .catch(error => {
            LoggerService.error('Failed to create payment', error);
            return Promise.reject(error);
        });
};

export const update = (id, data) => {
    const { name } = data;
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`, { id }));
    }

    return isUnique({ _id: itemId, name })
        .then(() => PaymentModel.findById(itemId))
        .then(payment => {
            if (!payment) {
                return Promise.reject(new Error('Failed to find payment'));
            }

            return extend(payment, getDataToUpdate(data));
        })
        .then(payment => payment.save())
        .then(payment => getById(payment._id))
        .catch(error => {
            LoggerService.error('Failed to update payment', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`, { id }));
    }

    return PaymentModel.findById(itemId)
        .then(payment => {
            if (!payment) {
                return Promise.reject(new Error('Failed to find payment', { id }));
            }

            return extend(payment, {
                isDeleted: true
            });
        })
        .then(payment => payment.save())
        .catch(error => {
            LoggerService.error('Failed to remove payment', error);
            return Promise.reject(error);
        });
};


