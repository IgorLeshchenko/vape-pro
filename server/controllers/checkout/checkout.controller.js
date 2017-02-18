'use strict';

// Node imports:
import { pick, each } from 'lodash';

// App Imports:
import configs from '../../../configs/config.json';
import LoggerService from '../../services/common/logger.service';
import EmailService from '../../services/notifications/email.service';
import OrdersController from '../orders/orders.controller';
import CartsController from '../cart/cart.controller';
import ShippingsController from '../shippings/shippings.controller';

const getDataToCreate = data => {
    return pick(data, [
        'customerFirstName', 'customerLastName', 'customerEmail', 'customerPhone', 'customerComment',
        'shippingTracking', 'shippingPrice', 'shippingCity', 'shippingStreet', 'shippingStreet', 'shippingHouse',
        'shippingPostOffice', 'products', 'shippingType', 'paymentType'
    ]);
};

const getShippingPrice = (userId, sessionId, shippingId) => {
    return Promise.all([
        CartsController.get(userId, sessionId),
        ShippingsController.getById(shippingId)
    ]).then(data => {
        const cart = data[0] || {};
        const shipping = data[1] || {};
        let shippingPrice = shipping.price;
        let cartPrice = 0;

        if (!cart || !cart.products.length) {
            return Promise.reject({ status: 400, message: 'Cart has no products' });
        }

        each(cart.products, cartProductItem => {
            cartPrice += cartProductItem.product.price * cartProductItem.amount;
        });

        if (cartPrice >= configs.app.shipping.freeFromPrice) {
            shippingPrice = 0;
        }

        return shippingPrice;
    });
};

const getProductsFromCart = (userId, sessionId) => {
    return CartsController.get(userId, sessionId)
        .then(cart => {
            const { products = [] } = cart || {};
            const productsToOrder = [];

            if (!products.length) {
                return Promise.reject({ status: 400, message: 'Cart has no products' });
            }

            each(products, cartProductItem => {
                const { product, container, amount } = cartProductItem;
                const { price } = product;

                productsToOrder.push({
                    product, container, amount, price
                });
            });
        });
};

export const create = (userId, sessionId, data) => {
    const dataToCreate = getDataToCreate(data);
    const { shippingType } = dataToCreate;

    return Promise.all([getShippingPrice(userId, sessionId), getProductsFromCart(userId, sessionId, shippingType)])
        .then(promiseData => {
            dataToCreate.products = promiseData[1];
            dataToCreate.shippingPrice = promiseData[0];

            return dataToCreate;
        })
        .then(orderData => OrdersController.create(orderData))
        .then(order => EmailService.sendNewOrderToAdmins(order))
        .catch(error => {
            LoggerService.error('Failed to create order (checkout). Message:', error.message);
            return Promise.reject(error);
        });
};
