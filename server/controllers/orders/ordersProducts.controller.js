'use strict';

// Node imports:
import { each } from 'lodash';

// App imports:
import LoggerService from '../../services/common/logger.service';
import ProductsController from '../products/products.controller';

export const bookProducts = order => {
    const { products } = order;
    const promiseActions = [];

    each(products, ({ product, amount }) => {
        const { id } = product;

        promiseActions.push(
            ProductsController.getById(id)
                .then(productToUpdate => {
                    const { amountAvailable } = productToUpdate;
                    const newAmountAvailable = amountAvailable - Math.abs(amount);

                    return ProductsController.update(productToUpdate._id, { amountAvailable: newAmountAvailable });
                })
                .then(() => {
                    return order;
                })
                .catch(error => {
                    LoggerService.error('Failed to update product amountAvailable', error, { id });
                    return Promise.reject(error);
                })
        );
    });

    return Promise.all(promiseActions);
};

export const unBookProducts = order => {
    const { products, status } = order;
    const promiseActions = [];

    if (status === 'new') {
        return Promise.resolve(order);
    }

    each(products, ({ product, amount }) => {
        const { id } = product;

        promiseActions.push(
            ProductsController.getById(id)
                .then(productToUpdate => {
                    const { amountAvailable } = productToUpdate;
                    const newAmountAvailable = amountAvailable + Math.abs(amount);

                    return ProductsController.update(productToUpdate._id, { amountAvailable: newAmountAvailable });
                })
                .then(() => {
                    return order;
                })
                .catch(error => {
                    LoggerService.error('Failed to update product amountAvailable. Message:', error.message);
                    return Promise.reject(error);
                })
        );
    });

    return Promise.all(promiseActions);
};

export const setProductsAsSold = order => {
    const { products } = order;
    const promiseActions = [];

    each(products, ({ product, amount }) => {
        const { id } = product;

        promiseActions.push(
            ProductsController.getById(id)
                .then(productToUpdate => {
                    const { amountSold } = productToUpdate;
                    const newAmountSold = amountSold + Math.abs(amount);

                    return ProductsController.update(productToUpdate._id, { amountSold: newAmountSold });
                })
                .then(() => {
                    return order;
                })
                .catch(error => {
                    LoggerService.error('Failed to update product amountSold. Message:', error.message);
                    return Promise.reject(error);
                })
        );
    });

    return Promise.all(promiseActions);
};
