'use strict';

// Node imports:
import express from 'express';
import url from 'url';

// App imports:
import * as SuppliesController from '../../controllers/supplies/supplies.controller';
import { checkAdminAuthAPI } from '../../middlewares/auth.middleware';

const router = express.Router();

router
    .get('/supplies', checkAdminAuthAPI, (req, res) => {
        const params = url.parse(req.url, true);
        const { page, size, status, query, sortBy, sortOrder } = params.query || {};
        const filters = { status, query };

        SuppliesController.getList({ page, size, sortBy, sortOrder, filters })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .get('/supplies/:status', checkAdminAuthAPI, (req, res) => {
        const params = url.parse(req.url, true);
        const status = req.params.status;
        const { page, size, query, sortBy, sortOrder } = params.query || {};
        const filters = { status, query };

        SuppliesController.getList({ page, size, sortBy, sortOrder, filters })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .get('/supplies/:status/:id', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;

        SuppliesController.getById(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/supplies', checkAdminAuthAPI, (req, res) => {
        const supplyData = req.body;

        SuppliesController.create(supplyData)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/supplies/:id/ship', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;

        SuppliesController.updateStatusToShipped(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/supplies/:id/receive', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;

        SuppliesController.updateStatusToReceived(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/supplies/:id/decline', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;

        SuppliesController.updateStatusToDeclined(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .put('/supplies/:id', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;
        const body = req.body;

        SuppliesController.update(id, body)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .delete('/supplies/:id', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;

        SuppliesController.remove(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    });

export default router;
