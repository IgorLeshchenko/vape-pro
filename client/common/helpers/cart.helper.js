'use strict';

// Third Party imports:
import { each } from 'lodash';

export const getCartAmount = ({ products }) => {
    let currentAmount = 0;

    each(products, ({ amount }) => {
        currentAmount += amount
    });

    return currentAmount;
};

export const getCartPrice = ({ products }) => {
    let price = 0;

    each(products, ({ amount, product }) => {
        price += amount * product.price;
    });

    return price;
};
