'use strict';

// Node Imports:
import isomorphicFetch from 'isomorphic-fetch';

// App Imports:
import configs from '../../../configs/config.json';

export const check = (req, captcha, done) => {
    const params = [
        `secret=${configs.server.reCaptcha}`,
        `response=${captcha}`,
    ].join('&');
    const requestLink = `https://www.google.com/recaptcha/api/siteverify?${params}`;

    isomorphicFetch(requestLink, { method: 'POST' })
        .then(response => {
            if (response.status !== 200) {
                return done(false);
            }

            return done(true);
        })
        .catch(error => done(error));
};

export default check;
