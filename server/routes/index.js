'use strict';

// Node imports:
import express from 'express';

// App imports:
import cartRoutes from './cart/cart.server-routes';
import usersRoutes from './users/users.server-routes';
import suppliesRoutes from './supplies/supplies.server-routes';

const router = express.Router();

router.use('/api', cartRoutes);
router.use('/api', usersRoutes);
router.use('/api', suppliesRoutes);

export default router;
