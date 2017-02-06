'use strict';

// Node imports:
import { isNull, extend, pick } from 'lodash';

// App imports:
import { castToObjectId, getQueryString } from '../../services/common/query-helpers.service';
import LoggerService from '../../services/common/logger.service';
import OrderModel from '../../models/order.model';
import OrderAggregation from '../../aggregations/orders/orders.aggregation';
import OrderProductsController from './ordersProducts.controller';

const getDataToUpdate = data => {
    return pick(data, [
        'customerFirstName', 'customerLastName', 'customerEmail', 'customerPhone', 'customerComment',
        'shippingTracking', 'shippingPrice', 'shippingCity', 'shippingStreet', 'shippingStreet', 'shippingHouse',
        'shippingPostOffice', 'products', 'shippingType', 'paymentType'
    ]);
};

export const getById = _id => {
    const itemId = castToObjectId(_id);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId', { _id }));
    }

    return OrderModel.findById(itemId)
        .populate({
            path: 'products.product',
            model: 'Product',
            populate: {
                path: 'gallery',
                model: 'Img'
            }
        })
        .populate('shippingType')
        .populate('paymentType')
        .exec()
        .then(order => {
            if (!order) {
                return Promise.reject(new Error('Failed to find order', { _id }));
            }

            return order.toJSON();
        });
};

export const getList = data => {
    const { page = 0, size = 0, sortBy = 'createdAt', sortOrder = 'desc', filters = {} } = data;
    const { query } = filters;
    const searchQuery = {
        isDeleted: false,
        $or: [{ name: getQueryString(query) }]
    };
    const aggregation = OrderAggregation.get({ searchQuery, page, size, sortBy, sortOrder });

    return OrderModel.count(searchQuery)
        .then(ordersCount => {
            if (ordersCount === 0) {
                return {};
            }

            return OrderModel.aggregate(aggregation)
                .then(orders => {
                    const pages = Math.floor(ordersCount / (+size || 0)) || 0;

                    return {
                        items: orders,
                        page: +page,
                        size: +size,
                        pages: +pages,
                        total: +ordersCount
                    };
                });
        })
        .catch(error => {
            LoggerService.error('Failed to get orders list', error);
            return Promise.reject(error);
        });
};

export const create = data => {
    return extend(new OrderModel(), getDataToUpdate(data)).save()
        .then(order => getById(order._id))
        .catch(error => {
            LoggerService.error('Failed to create order', error);
            return Promise.reject(error);
        });
};

export const update = (id, data) => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId'));
    }

    return OrderModel.findById(itemId)
        .then(order => {
            if (!order) {
                return Promise.reject(new Error('Failed to find order'));
            }

            return extend(order, getDataToUpdate(data));
        })
        .then(order => order.save())
        .then(order => getById(order._id))
        .catch(error => {
            LoggerService.error('Failed to update order', error);
            return Promise.reject(error);
        });
};

export const remove = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId'));
    }

    return OrderModel.findById(itemId)
        .then(order => {
            if (!order) {
                return Promise.reject(new Error('Failed to find order', { id }));
            }

            return extend(order, {
                isDeleted: true
            });
        })
        .then(order => order.save())
        .catch(error => {
            LoggerService.error('Failed to remove order', error, { id });
            return Promise.reject(error);
        });
};

export const updateStatusToApproved = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId'));
    }

    return update(id, { status: 'approved', approvedAt: Date.now() })
        .then(order => OrderProductsController.bookProducts(order))
        .catch(error => {
            LoggerService.error('Failed to update order status (approved)', error, { id });
            return Promise.reject(error);
        });
};

export const updateStatusToDeclined = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId'));
    }

    return update(id, { status: 'declined', declinedAt: Date.now() })
        .then(order => OrderProductsController.unBookProducts(order))
        .catch(error => {
            LoggerService.error('Failed to update order status (declined)', error, { id });
            return Promise.reject(error);
        });
};

export const updateStatusToReceived = id => {
    const itemId = castToObjectId(id);

    if (isNull(itemId)) {
        return Promise.reject(new Error('Failed to cast to ObjectId'));
    }

    return update(id, { status: 'received', receivedAt: Date.now() })
        .then(order => OrderProductsController.setProductsAsSold(order))
        .catch(error => {
            LoggerService.error('Failed to update order status (received)', error, { id });
            return Promise.reject(error);
        });
};
