'use strict';

// Third Party imports:
import React from 'react'
import { applyMiddleware, createStore, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { render } from 'react-dom'
import { reduxReactRouter, ReduxRouter } from 'redux-router';
import { browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

// App imports:
import configs from '../configs/config.json';
import combineReducers from './store/combineReducers';
import router from './router/router';

const AppInitState = window.$REDUX_STATE || {};
let store;

if (configs.mode === 'production') {
    store = createStore(
        combineReducers,
        AppInitState,
        compose(
            reduxReactRouter({ router, browserHistory }),
            applyMiddleware(thunkMiddleware)
        )
    )
} else {
    store = createStore(
        combineReducers,
        AppInitState,
        composeWithDevTools(
            reduxReactRouter({ router, browserHistory }),
            applyMiddleware(thunkMiddleware)
        )
    )
}

render(
    <Provider store={store}>
        <ReduxRouter />
    </Provider>,
    document.getElementById('app-mount-point')
);
