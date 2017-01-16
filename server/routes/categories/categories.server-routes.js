'use strict';

// Node imports:
import express from 'express';
import { isUndefined, isEmpty } from 'lodash';

// App imports:
import * as CategoriesController from '../../controllers/categories/categories.controller';
import * as ValidationSchemas from './categories.validation-schemas';

const router = express.Router();

router
    .get('/categories', (req, res) => {
        res.send(`GET: /api/categories called`);

        // TODO 
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
    });

router
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
        res.send(`PUT: /api/categories/${req.params.id} called`);

        // TODO 
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
