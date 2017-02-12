'use strict';

// Node imports:
import express from 'express';
import url from 'url';
import passport from 'passport';

// App imports:
import * as UsersController from '../../controllers/users/users.controller';
import { setUserRole, checkUserAuthAPI, checkAdminAuthAPI } from '../../middlewares/auth.middleware';

const router = express.Router();

router
    .post('/users/auth/a/sign-in', setUserRole('admin'), passport.authenticate('local-login'), (req, res) => {
        if (req.user) {
            res.status(200).send(req.user);
        } else {
            res.status(401).send({ 'message': 'Unauthorized' });
        }
    })
    .post('/users/auth/c/sign-in', setUserRole('customer'), passport.authenticate('local-login'), (req, res) => {
        if (req.user) {
            res.status(200).send(req.user);
        } else {
            res.status(401).send({ 'message': 'Unauthorized' });
        }
    })
    .post('/users/auth/sign-out', (req, res) => {
        req.logout();
        res.status(200).json({ 'message': 'Unauthorized' });
    })
    .get('/users', checkAdminAuthAPI, (req, res) => {
        const params = url.parse(req.url, true);
        const { page, size, status, role, query, sortBy, sortOrder } = params.query || {};
        const filters = { status, role, query };

        UsersController.getList({ page, size, sortBy, sortOrder, filters })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .get('/users/me', checkUserAuthAPI, (req, res) => {
        const userId = req.user ? req.user._id : null;

        UsersController.getById(userId)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .get('/users/:id', checkAdminAuthAPI, (req, res) => {
        const userId = req.params.id;

        UsersController.getById(userId)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .put('/users/:id', checkAdminAuthAPI, (req, res) => {
        const userId = req.params.id;
        const userData = req.body;

        UsersController.update(userId, userData)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .delete('/users/:id', checkAdminAuthAPI, (req, res) => {
        const userId = req.params.id;

        UsersController.remove(userId)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    });

export default router;
