'use strict';

// Node imports:
import express from 'express';

// App imports:
import categoryRoutes from './categories/categories.server-routes';

const router = express.Router();

// Private API:
router.use('/api/mgm', categoryRoutes);

export default router;
