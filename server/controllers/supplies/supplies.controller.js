'use strict';

// Node imports:
import { each, isNull, extend, pick } from 'lodash';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import SupplyModel from '../../models/supply.model';
import SupplyAggregation from '../../aggregations/supplies.aggregation';
import ProductsController from '../products/products.controller';

const getDataToUpdate = data => {
    return pick(data, [
        'status', 'products', 'shippingTracking', 'shippingPrice', 'customsPrice', 'shippedAt', 'declinedAt'
    ]);
};

const updateProductsAfterSupplyComplete = supply => {
    const { products } = supply;
    const promises = [];

    each(products, ({ product, amount }) => {
        promises.push(ProductsController.update(product._id, {
            amountAvailable: Math.abs(amount),
            amountBought: Math.abs(amount)
        }));
    });

    return Promise.all(promises)
        .then(() => {
            return supply;
        });
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`, { _id }));
    }

    return SupplyModel.findById(itemId)
        .populate({
            path: `products.product`,
            model: `Product`,
            populate: {
                path: `gallery`,
                model: `Img`
            }
        })
        .exec()
        .then(supply => {
            if (!supply) {
                return Promise.reject(new Error('Failed to find supply', { _id }));
            }

            return supply.toJSON();
        });
};

export const getList = data => {
    const { page = 0, size = 0, sortBy = 'createdAt', sortOrder = 'desc', filters = {} } = data;
    const { query } = filters;
    const searchQuery = {
        isDeleted: false,
        $or: [{ name: getQueryString(query) }]
    };
    const aggregation = SupplyAggregation.get({ searchQuery, page, size, sortBy, sortOrder });

    return SupplyModel.count(searchQuery)
        .then(suppliesCount => {
            if (suppliesCount === 0) {
                return {};
            }

            return SupplyModel.aggregate(aggregation)
                .then(supplies => {
                    const pages = Math.floor(suppliesCount / (+size || 0)) || 0;

                    return {
                        items: supplies,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +suppliesCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get supplies list', error);
            return Promise.reject(error);
        });
};

export const create = data => {
    return extend(new SupplyModel(), getDataToUpdate(data)).save()
        .then(supply => getById(supply._id))
        .catch(error => {
            LoggerService.error('Failed to create supply', error);
            return Promise.reject(error);
        });
};

export const update = (id, data) => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return SupplyModel.findById(itemId)
        .then(supply => {
            if (!supply) {
                return Promise.reject(new Error('Failed to find supply'));
            }

            return extend(supply, getDataToUpdate(data));
        })
        .then(supply => supply.save())
        .then(supply => getById(supply._id))
        .catch(error => {
            LoggerService.error('Failed to update supply', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return SupplyModel.findById(itemId)
        .then(supply => {
            if (!supply) {
                return Promise.reject(new Error('Failed to find supply', { id }));
            }

            return extend(supply, {
                isDeleted: true
            });
        })
        .then(supply => supply.save())
        .catch(error => {
            LoggerService.error('Failed to remove supply', error, { id });
            return Promise.reject(error);
        });
};

export const updateStatusToShipped = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return update(id, { status: `shipped`, shippedAt: Date.now() })
        .catch(error => {
            LoggerService.error('Failed to update supply status (shipped)', error, { id });
            return Promise.reject(error);
        });
};

export const updateStatusToDeclined = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`));
    }

    return update(id, { status: `declined`, declinedAt: Date.now() })
        .catch(error => {
            LoggerService.error('Failed to update supply status (declined)', error, { id });
            return Promise.reject(error);
        });
};

export const updateStatusToReceived = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error(`Failed to cast to ObjectId`, { id }));
    }

    return SupplyModel.findById(itemId)
        .then(supply => updateProductsAfterSupplyComplete(supply))
        .then(supply => update(supply._id, { status: `received`, receivedAt: Date.now() }))
        .catch(error => {
            LoggerService.error('Failed to update supply status (received)', error, { id });
            return Promise.reject(error);
        });
};
