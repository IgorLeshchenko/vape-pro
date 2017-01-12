'use strict';

// Third Party imports:
import React from 'react'
import { applyMiddleware, createStore, compose } from 'redux';
import { ReduxRouter } from 'redux-router';
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

// App Imports:
import { fetchComponentsData } from './componentsData.service';
import combineReducers from '../../../client/store/combineReducers';

const getFullPageHTML = (html, state) => {
    return `
        <!doctype html>
        <html lang="utf-8">
          <head>
            
          </head>
          <body>
          <div class="container">${html}</div>
            <script>window.$REDUX_STATE = ${JSON.stringify(state)}</script>
          </body>
        </html>
    `;
};

export default (req, renderProps) => {
    const { components, params } = renderProps;
    const finalCreateStore = compose(applyMiddleware(thunkMiddleware))(createStore);
    const store = finalCreateStore(combineReducers);

    return fetchComponentsData(store.dispatch, components, params)
        .then(() => {
            const initView = renderToString((
                <Provider store={store}>
				  <ReduxRouter />
				</Provider>
            ));

            return getFullPageHTML(initView, store.getState());
        })
        .catch((error) => req.status(500).send({ error }));
}
