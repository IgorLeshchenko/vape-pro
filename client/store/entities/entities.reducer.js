'use strict';

// Third Party imports:
import { combineReducers }      from 'redux';

// App imports:
import createEntities           from '../hor/createEntity.hor';

const entitiesReducer = combineReducers({
    users: createEntities('users'),
    carts: createEntities('carts'),
    categories: createEntities('categories'),
    comments: createEntities('comments'),
    containers: createEntities('containers'),
    directories: createEntities('directories'),
    imgs: createEntities('imgs'),
    manufacturers: createEntities('manufacturers'),
    orders: createEntities('orders'),
    payments: createEntities('payments'),
    products: createEntities('products'),
    productsTypes: createEntities('productsTypes'),
    reviews: createEntities('reviews'),
    shippings: createEntities('shippings'),
    supplies: createEntities('supplies')
});

export default entitiesReducer;
