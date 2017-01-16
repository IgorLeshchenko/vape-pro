'use strict';

// Node imports:
import express from 'express';

// App imports:
import cartRoutes from './cart/cart.server-routes';

import categoryRoutes from './categories/categories.server-routes';
import directoryRoues from './diectories/directories.server-routes';
import manufacturersRoues from './manufacturers/manufacturers.server-routes';
import paymentsRoutes from './payments/payments.server-routes';
import shippingRoutes from './shippings/shippings.server-routes';

const router = express.Router();

// Public API:
router.use('/api', cartRoutes);

// Private API:
router.use('/api/mgm', categoryRoutes);
router.use('/api/mgm', directoryRoues);
router.use('/api/mgm', manufacturersRoues);
router.use('/api/mgm', paymentsRoutes);
router.use('/api/mgm', shippingRoutes);

export default router;
