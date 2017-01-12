'use strict';

// Third Party imports:
import React from 'react';
import { Route } from 'react-router';

// App imports:
import App from '../App.jsx';

export default (
    <Route path="/" component={App}>
        <Route path="shop" components={}>
            <Route path="d" components={}>
                <Route path=":directory" components={}>
                    <Route path="c" components={}>
                        <Route path=":category" components={} />
                    </Route>
                    <Route path="m" components={}>
                        <Route path=":manufacturer" components={} />
                    </Route>
                </Route>
            </Route>
            <Route path="p" components={}>
                <Route path=":path" components={} />
            </Route>
            <Route path="m" components={}>
                <Route path=":path" components={} />
            </Route>
        </Route>
        <Route path="about"
            components={} />
        <Route path="qa"
            components={} />
        <Route path="contacts"
            components={} />
        <Route path="checkout"
            components={} />
    </Route>
);
