'use strict';

// Node imports:
import express from 'express';

const router = express.Router();

router
    .get('/cart', (req, res) => {
        res.send(`GET: /api/cart called`);
    });

export default router;
