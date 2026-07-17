import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { Role } from '../../../generated/prisma/enums.js';
import { orderController } from './order.controller.js';

const router = Router();

router.post('/', auth(Role.CUSTOMER), orderController.createOrder);

router.get('/', auth(Role.CUSTOMER), orderController.getMyOrders);

router.get('/:id', auth(Role.CUSTOMER), orderController.getSingleOrder);

export const orderRoute = router;
