'use strict';

// Node imports:
import { isNull, each } from 'lodash';
import sanitize from 'mongo-sanitize';

// App imports:
import LoggerService from '../../services/common/logger.service';
import CartModel from '../../models/cart.model';

const getProductIndexInCart = (cartItems, product) => {
    let searchIndex = null;

    each(cartItems, (cartItem, index) => {
        if (cartItem.product._id === product._id && isNull(searchIndex)) {
            searchIndex = index;
        }
    });

    return searchIndex;
};

export const get = (user, session) => {
    const searchQuery = {};

    if (user) {
        searchQuery.user = user;
    } else {
        searchQuery.session = session;
    }

    return CartModel.findOne(searchQuery)
        .populate({ path: 'products.container', model: 'Container' })
        .populate({ path: 'products.product', model: 'Product', populate: { path: 'gallery', model: 'Img' } })
        .exec()
        .then(cart => {
            if (cart) {
                return cart;
            }

            return create(user, session);
        })
        .then(cart => {
            return cart.toJSON();
        })
        .catch(error => {
            LoggerService.error('Failed to get cart', { user, session });
            return Promise.reject(error);
        });
};

export const create = (user, session) => {
    const cart = new CartModel({ user, session, products: [] });

    return cart.save()
        .catch(error => {
            LoggerService.error('Failed to create cart', { user, session });
            return Promise.reject(error);
        });
};

export const remove = (user, session) => {
    const searchQuery = {};

    if (user) {
        searchQuery.user = user;
    } else {
        searchQuery.session = session;
    }

    return CartModel.findOne(searchQuery)
        .then(cart => cart.remove())
        .then(() => get(user, session))
        .catch(error => {
            LoggerService.error('Failed to remove cart', { user, session });
            return Promise.reject(error);
        });
};

export const productCreate = (user, session, data) => {
    const { product, container, amount } = data;

    return get(user, session)
        .then(cart => {
            const productIndex = getProductIndexInCart(cart.products, product);

            if (!isNull(productIndex)) {
                const cartProduct = cart.products[productIndex].toJSON();

                cart.products[productIndex] = Object.assign({}, cartProduct, {
                    amount: cartProduct.amount + sanitize(amount)
                });
            } else {
                cart.products.push({
                    product: sanitize(product.id),
                    container: sanitize(container.id),
                    amount: sanitize(amount < 1 ? 1 : amount)
                });
            }

            return cart;
        })
        .then(cart => cart.save())
        .then(() => get(user, session))
        .catch(error => {
            LoggerService.error('Failed to create product in cart', { user, session, product, container, amount });
            return Promise.reject(error);
        });
};

export const productUpdate = (user, session, data) => {
    const { product, container, amount } = data;

    return get(user, session)
        .then(cart => {
            const productIndex = getProductIndexInCart(cart.products, product);

            if (!isNull(productIndex)) {
                const cartProduct = cart.products[productIndex].toJSON();

                cart.products[productIndex] = Object.assign({}, cartProduct, {
                    amount: sanitize(amount)
                });
            }

            return cart;
        })
        .then(cart => cart.save())
        .then(() => get(user, session))
        .catch(error => {
            LoggerService.error('Failed to update product in cart', { user, session, product, container, amount });
            return Promise.reject(error);
        });
};

export const productRemove = (user, session, data) => {
    const { product, container, amount } = data;

    return get(user, session)
        .then(cart => {
            const productIndex = getProductIndexInCart(cart.products, product);

            if (!isNull(productIndex)) {
                cart.products = [
                    ...cart.products.slice(0, productIndex),
                    ...cart.products.slice(productIndex + 1)
                ];
            }

            return cart;
        })
        .then(cart => cart.save())
        .then(() => get(user, session))
        .catch(error => {
            LoggerService.error('Failed to remove product in cart', { user, session, product, container, amount });
            return Promise.reject(error);
        });
};
