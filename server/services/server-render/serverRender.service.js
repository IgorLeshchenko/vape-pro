'use strict';

// Third Party imports:
import React from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import { RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

// App Imports:
import { fetchComponentsData } from './componentsData.service';
import combineReducers from '../../../client/store/combineReducers';

export const isPageRequest = req => {
    const { url } = req;
    const hasFileExtension = url.split('.').length > 1;
    const hasApiPrefix = url.indexOf('/api') !== -1;
    const hasStaticPrefix = url.indexOf('/static') !== -1;

    return !hasFileExtension && !hasApiPrefix && !hasStaticPrefix;
};

const getFullPageHTML = (html, state) => {
    return `
        <!doctype html>
        <html lang="utf-8">
          <head>
            
          </head>
          <body>
          <div id="app-mount-point">${html}</div>
            <script>window.$REDUX_STATE = ${JSON.stringify(state)}</script>
            <script src="/assets/app-bundle.js"></script>
          </body>
        </html>
    `;
};

export default (req, renderProps) => {
    const { components, params } = renderProps;
    const store = compose(
        applyMiddleware(thunkMiddleware)
    )(createStore)(combineReducers);

    return fetchComponentsData(store.dispatch, components, params)
        .then(() => {
            const initView = renderToString((
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            ));

            return getFullPageHTML(initView, store.getState());
        });
};
