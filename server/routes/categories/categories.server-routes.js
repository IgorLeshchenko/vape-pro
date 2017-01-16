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
    })
    .post('/categories', (req, res) => {
        const { body } = req;

        req.checkBody(ValidationSchemas.itemCreateSchema);
        req.getValidationResult().then(result => {
            if (!result.isEmpty()) {
                return res.status(400).json({ validation: result.array() });
            }

            CategoriesController.create(body)
                .then((payload) => {
                    const { status, code, msg, data } = payload;

                    if (!isUndefined(data)) {
                        res.status(200).json(data);
                    } else {
                        res.status(status).json({ code, msg });
                    }
                })
                .catch(({ status = 500, code, msg = 'Server Error' } = {}) => {
                    res.status(status).send({ msg, code })
                });
        });
    });

router
    .get('/categories/:id', (req, res) => {
        res.send(`GET: /api/categories/${req.params.id} called`);
    })
    .put('/categories/:id', (req, res) => {
        res.send(`PUT: /api/categories/${req.params.id} called`);
    })
    .delete('/categories/:id', (req, res) => {
        res.send(`DELETE: /api/categories/${req.params.id} called`);
    });

export default router;
