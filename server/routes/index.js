'use strict';

// Node imports:
import express from 'express';

// App imports:
import cartRoutes from './cart/cart.server-routes';

import categoryRoutes from './categories/categories.server-routes';

const router = express.Router();

// Public API:
router.use('/api', cartRoutes);

// Private API:
router.use('/api/mgm', categoryRoutes);

export default router;
