'use strict';

// Node imports:
import express from 'express';

const router = express.Router();

router
    .get('/manufacturers', (req, res) => {
        res.send(`GET: /api/manufacturers called`);
    })
    .post('/manufacturers', (req, res) => {
        res.send(`POST: /api/manufacturers called`);
    });

router
    .get('/manufacturers/:id', (req, res) => {
        res.send(`GET: /api/manufacturers/${req.params.id} called`);
    })
    .put('/manufacturers/:id', (req, res) => {
        res.send(`PUT: /api/manufacturers/${req.params.id} called`);
    })
    .delete('/manufacturers/:id', (req, res) => {
        res.send(`DELETE: /api/manufacturers/${req.params.id} called`);
    });

export default router;
