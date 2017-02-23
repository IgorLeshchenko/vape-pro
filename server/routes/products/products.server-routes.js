'use strict';

// Node imports:
import express from 'express';
import url from 'url';

// App imports:
import * as ProductsController from '../../controllers/products/products.controller';
import { checkAdminAuthAPI } from '../../middlewares/auth.middleware';

const router = express.Router();

router
    .get('/products', checkAdminAuthAPI, (req, res) => {
        const params = url.parse(req.url, true);
        const { page, size, status, type, query, sortBy, sortOrder } = params.query || {};
        const filters = { status, type, query };

        ProductsController.getList({ page, size, sortBy, sortOrder, filters })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .get('/products/:id', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;

        ProductsController.getById(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/products', checkAdminAuthAPI, (req, res) => {
        const productData = req.body;

        ProductsController.create(productData)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .put('/products/:id', checkAdminAuthAPI, (req, res) => {
        const productId = req.params.id;
        const productData = req.body;

        ProductsController.update(productId, productData)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .delete('/products/:id', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;

        ProductsController.remove(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    });

export default router;
