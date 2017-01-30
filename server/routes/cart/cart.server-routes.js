'use strict';

// Node imports:
import express from 'express';

// App imports:
import * as CartController from '../../controllers/cart/cart.controller';

const router = express.Router();

router
    .get('/cart', (req, res) => {
        const { user = {}, sessionID } = req;

        CartController.get(user.id, sessionID)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/cart/create-product', (req, res) => {
        const { body, user = {}, sessionID } = req;

        CartController.productCreate(user.id, sessionID, body)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/cart/update-product', (req, res) => {
        const { body, user = {}, sessionID } = req;

        CartController.productUpdate(user.id, sessionID, body)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(500).send({ message: error.message || 'Server Error' });
            });
    })
    .post('/cart/remove-product', (req, res) => {
        const { body, user = {}, sessionID } = req;

        CartController.productRemove(user.id, sessionID, body)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(500).send({ message: error.message || 'Server Error' });
            });
    })
    .delete('/cart', (req, res) => {
        const { user = {}, sessionID } = req;

        CartController.remove(user.id, sessionID)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                res.status(500).send({ message: error.message || 'Server Error' });
            });
    });

export default router;
