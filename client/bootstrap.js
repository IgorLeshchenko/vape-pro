'use strict';

// Third Party imports:
import React from 'react'
import { applyMiddleware, createStore, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { render } from 'react-dom'
import { Router, match, browserHistory as history } from 'react-router'
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

// App imports:
import configs from '../configs/config.json';
import combineReducers from './store/combineReducers';
import routes from './router/routes';

const AppInitState = window.$REDUX_STATE || {};
let store;

if (configs.mode === 'production') {
    store = createStore(
        combineReducers,
        AppInitState,
        compose(
            applyMiddleware(thunkMiddleware)
        )
    )
} else {
    store = createStore(
        combineReducers,
        AppInitState,
        composeWithDevTools(
            applyMiddleware(thunkMiddleware)
        )
    )
}

match({ history, routes }, (error, redirectLocation, renderProps) => {
    render(
        <Provider store={store}>
            <Router {...renderProps} />
        </Provider>,
        document.getElementById('app-mount-point')
    );
});
