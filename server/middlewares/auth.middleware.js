'use strict';

// Node imports:
import { isEmpty } from 'lodash';

export const setUserRole = role => (req, res, next) => {
    if (req.body) {
        req.body.role = role;
    }

    next();
};

export const checkUserAuthAPI = (req, res, next) => {
    const isUserAuthorized = req.user && !isEmpty(req.user._id);

    console.log(req.user, req.session);

    if (!isUserAuthorized) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        next();
    }
};

export const checkAdminAuthAPI = (req, res, next) => {
    const isUserAdmin = req.user && req.user.role === 'admin';

    if (!isUserAdmin) {
        res.status(401).send({
            message: 'Unauthorized'
        });
    } else {
        next();
    }
};
