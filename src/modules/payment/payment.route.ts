import { Router } from 'express';
import { paymentController } from './payment.controller.js';
import { auth } from '../../middleware/auth.js';
import { Role } from '../../../generated/prisma/enums.js';

const router = Router();

router.post(
    '/create',
    auth(Role.CUSTOMER),
    paymentController.createCheckoutSession,
);
router.post('webhook', paymentController.handleWebhook);
router.get('/', auth(Role.CUSTOMER), paymentController.getMyPaymentHistory);
router.get('/:id', auth(Role.CUSTOMER), paymentController.getSinglePaymentData);

export const paymentRoute = router;
