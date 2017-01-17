'use strict';

// Node imports:
import express from 'express';
import url from 'url';
import { isUndefined, isEmpty } from 'lodash';

// App imports:
import * as CategoriesController from '../../controllers/categories/categories.controller';
import * as ValidationSchemas from './categories.validation-schemas';

const router = express.Router();

router
    .get('/categories', (req, res) => {
        const params = url.parse(req.url, true);
        const { page, size, status, directory, query, sortBy, sortOrder } = params.query || {};
        const filters = { status, directory, query };
        
        CategoriesController.getList({ page, size, sortBy, sortOrder, filters })
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/categories', (req, res) => {
        const { body } = req;

        req.checkBody(ValidationSchemas.itemCreateSchema);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                return res.status(400).json({ validation: result.array() });
            }

            CategoriesController.create(body)
                .then(data => {
                    res.status(200).json(data);
                })
                .catch(error => {
                    res.status(500).send({ message: error.message || 'Server Error' });
                });
        });
    })
    .get('/categories/:id', (req, res) => {
        const { id } = req.params;

        req.checkParams(ValidationSchemas.itemRemoveOrGetSchema);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                return res.status(400).json({ validation: result.array() });
            }

            CategoriesController.getById(id)
                .then((data) => {
                    res.status(200).json(data);
                })
                .catch(error => {
                    res.status(500).send({ message: error.message || 'Server Error' });
                });
        });
    })
    .put('/categories/:id', (req, res) => {
        const { id } = req.params;
        const { body } = req;
        
        req.checkParams(ValidationSchemas.itemUpdateSchema);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                return res.status(400).json({ validation: result.array() });
            }

            CategoriesController.update(id, body)
                .then((data) => {
                    res.status(200).json(data);
                })
                .catch(error => {
                    res.status(500).send({ message: error.message || 'Server Error' });
                });
        });
    })
    .delete('/categories/:id', (req, res) => {
        const { id } = req.params;

        req.checkParams(ValidationSchemas.itemRemoveOrGetSchema);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                return res.status(400).json({ validation: result.array() });
            }

            CategoriesController.remove(id)
                .then((result) => {
                    res.status(200).json({});
                })
                .catch(error => {
                    res.status(500).send({ message: error.message || 'Server Error' });
                });
        });
    });

export default router;
