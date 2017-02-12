'use strict';

// Node imports:
import express from 'express';

// App imports:
import cartRoutes from './cart/cart.server-routes';
import categoryRoutes from './categories/categories.server-routes';
import usersRoutes from './users/users.server-routes';

const router = express.Router();

router.use('/api', cartRoutes);
router.use('/api', categoryRoutes);
router.use('/api', usersRoutes);

export default router;
