'use strict';

// Node imports:
import express from 'express';

const router = express.Router();

router
    .get('/directories', (req, res) => {
        res.send(`GET: /api/directories called`);
    })
    .post('/directories', (req, res) => {
        res.send(`POST: /api/directories called`);
    });

router
    .get('/directories/:id', (req, res) => {
        res.send(`GET: /api/directories/${req.params.id} called`);
    })
    .put('/directories/:id', (req, res) => {
        res.send(`PUT: /api/directories/${req.params.id} called`);
    })
    .delete('/directories/:id', (req, res) => {
        res.send(`DELETE: /api/directories/${req.params.id} called`);
    });

export default router;
