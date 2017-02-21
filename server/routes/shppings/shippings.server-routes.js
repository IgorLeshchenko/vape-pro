'use strict';

// Node imports:
import express from 'express';
import url from 'url';

// App imports:
import * as ShippingsController from '../../controllers/shippings/shippings.controller';
import { checkAdminAuthAPI } from '../../middlewares/auth.middleware';

const router = express.Router();

router
    .get('/shippings', (req, res) => {
        const params = url.parse(req.url, true);
        const { page, size, status, query, sortBy, sortOrder } = params.query || {};
        const filters = { status, query };

        ShippingsController.getList({ page, size, sortBy, sortOrder, filters })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .get('/shippings/:id', (req, res) => {
        const shippingId = req.params.id;

        ShippingsController.getById(shippingId)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/shippings', checkAdminAuthAPI, (req, res) => {
        const shippingData = req.body;

        ShippingsController.create(shippingData)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .put('/shippings/:id', checkAdminAuthAPI, (req, res) => {
        const shippingId = req.params.id;
        const shippingData = req.body;

        ShippingsController.update(shippingId, shippingData)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .delete('/shippings/:id', checkAdminAuthAPI, (req, res) => {
        const shippingId = req.params.id;

        ShippingsController.remove(shippingId)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    });

export default router;
