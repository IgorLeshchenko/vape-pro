'use strict';

// Node imports:
import { each } from 'lodash';

// App imports:
import LoggerService from '../../services/common/logger.service';
import ProductsController from '../products/products.controller';

export const updateProductsAmountAfterSupply = supply => {
    const { products } = supply;
    const promiseActions = [];

    each(products, ({ product, amount }) => {
        const { id } = product;

        promiseActions.push(
            ProductsController.getById(id)
                .then(productToUpdate => {
                    const { amountAvailable, amountBought } = productToUpdate;
                    const newAmountAvailable = amountAvailable + Math.abs(amount);
                    const newAmountBought = amountBought + Math.abs(amount);

                    return ProductsController.update(productToUpdate._id, {
                        amountAvailable: newAmountAvailable,
                        amountBought: newAmountBought
                    });
                })
                .then(() => {
                    return supply;
                })
                .catch(error => {
                    LoggerService.error('Failed to update product amountAvailable and amountBought', error, { id });
                    return Promise.reject(error);
                })
        );
    });

    return Promise.all(promiseActions);
};
