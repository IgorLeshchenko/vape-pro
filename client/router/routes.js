'use strict';

// Third Party imports:
import React from 'react';
import { Route, IndexRoute } from 'react-router';

// App imports:
import App from '../App.jsx';
import LandingPage from '../pages/shop/landing/Landing.jsx';

export default (
    <Route path="/" component={App}>
        <IndexRoute components={{ content: LandingPage }} />

        <Route path="shop" components={{}}>
            <Route path="d" components={{}}>
                <Route path=":directory" components={{}}>
                    <Route path="c" components={{}}>
                        <Route path=":category" components={{}} />
                    </Route>
                    <Route path="m" components={{}}>
                        <Route path=":manufacturer" components={{}} />
                    </Route>
                </Route>
            </Route>
            <Route path="p" components={{}}>
                <Route path=":path" components={{}} />
            </Route>
            <Route path="m" components={{}}>
                <Route path=":path" components={{}} />
            </Route>
        </Route>
        <Route path="about"
            components={{}} />
        <Route path="qa"
            components={{}} />
        <Route path="contacts"
            components={{}} />
        <Route path="checkout"
            components={{}} />
    </Route>
);
