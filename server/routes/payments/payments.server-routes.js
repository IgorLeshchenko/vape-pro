'use strict';

// Node imports:
import express from 'express';

const router = express.Router();

router
    .get('/payments', (req, res) => {
        res.send(`GET: /api/payments called`);
    })
    .post('/payments', (req, res) => {
        res.send(`POST: /api/payments called`);
    });

router
    .get('/payments/:id', (req, res) => {
        res.send(`GET: /api/payments/${req.params.id} called`);
    })
    .put('/payments/:id', (req, res) => {
        res.send(`PUT: /api/payments/${req.params.id} called`);
    })
    .delete('/payments/:id', (req, res) => {
        res.send(`DELETE: /api/payments/${req.params.id} called`);
    });

export default router;
