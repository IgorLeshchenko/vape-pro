'use strict';

// Node imports:
import express from 'express';

const router = express.Router();

router
    .get('/shippings', (req, res) => {
        res.send(`GET: /api/shippings called`);
    })
    .post('/shippings', (req, res) => {
        res.send(`POST: /api/shippings called`);
    });

router
    .get('/shippings/:id', (req, res) => {
        res.send(`GET: /api/shippings/${req.params.id} called`);
    })
    .put('/shippings/:id', (req, res) => {
        res.send(`PUT: /api/shippings/${req.params.id} called`);
    })
    .delete('/shippings/:id', (req, res) => {
        res.send(`DELETE: /api/shippings/${req.params.id} called`);
    });

export default router;
