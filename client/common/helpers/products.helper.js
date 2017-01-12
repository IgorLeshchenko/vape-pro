'use strict';

// Third Party imports:
import { each } from 'lodash';

export const getProduct = (activeProduct, products) => {
    const { id } = activeProduct || {};

    if (id) {
        return getProductById(id, products);
    } else {
        return getProductInStock(products);
    }
};

export const getProductById = (id, products) => {
    let activeProduct = {};

    each(products, ({ product }) => {
        if (product.id === id && !activeProduct.id) {
            activeProduct = product;
        }
    });

    return activeProduct;
};

export const getProductInStock = (products) => {
    let productInStock = {};

    each(products, ({ product }) => {
        if (!productInStock.id && product.amountAvailable) {
            productInStock = product;
        }
    });

    if (!productInStock.id) {
        productInStock = products.length ? products[0].product : {};
    }

    return productInStock;
};
