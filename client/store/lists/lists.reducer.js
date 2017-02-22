'use strict';

// Third Party imports:
import { combineReducers }      from 'redux';

// App imports:
import createList               from '../hor/createList.hor';

const listReducer = combineReducers({
    users: createList('users'),
    carts: createList('carts'),
    categories: createList('categories'),
    comments: createList('comments'),
    containers: createList('containers'),
    containersTopSellers: createList('containersTopSellers'),
    containersNewSellers: createList('containersNewSellers'),
    directories: createList('directories'),
    imgs: createList('imgs'),
    manufacturers: createList('manufacturers'),
    orders: createList('orders'),
    payments: createList('payments'),
    products: createList('products'),
    productsTypes: createList('productsTypes'),
    reviews: createList('reviews'),
    shippings: createList('shippings'),
    supplies: createList('supplies')
});

export default listReducer;
