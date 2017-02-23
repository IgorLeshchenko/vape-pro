'use strict';

// Node imports:
import express from 'express';
import url from 'url';

// App imports:
import * as ProductsTypeController from '../../controllers/products-type/productsType.controller';
import { checkAdminAuthAPI } from '../../middlewares/auth.middleware';

const router = express.Router();

router
    .get('/products-types', checkAdminAuthAPI, (req, res) => {
        const params = url.parse(req.url, true);
        const { page, size, status, query, sortBy, sortOrder } = params.query || {};
        const filters = { status, query };

        ProductsTypeController.getList({ page, size, sortBy, sortOrder, filters })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .get('/products-types/:id', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;

        ProductsTypeController.getById(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/products-types', checkAdminAuthAPI, (req, res) => {
        const productTypeData = req.body;

        ProductsTypeController.create(productTypeData)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .put('/products-types/:id', checkAdminAuthAPI, (req, res) => {
        const productTypeId = req.params.id;
        const productTypeData = req.body;

        ProductsTypeController.update(productTypeId, productTypeData)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    })
    .delete('/products-types/:id', checkAdminAuthAPI, (req, res) => {
        const id = req.params.id;

        ProductsTypeController.remove(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(error.status || 500).send({ message: error.message || 'Server Error' });
            });
    });

export default router;
