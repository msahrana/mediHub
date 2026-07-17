import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { Role } from '../../../generated/prisma/enums.js';
import { reviewController } from './review.controller.js';

const router = Router();

router.post('/', auth(Role.CUSTOMER), reviewController.createReview);
router.get('/', auth(Role.CUSTOMER), reviewController.getAllReviews);
router.get('/:id', auth(Role.CUSTOMER), reviewController.getSingleReview);
router.patch('/:id', auth(Role.CUSTOMER), reviewController.updateReview);
router.delete('/:id', auth(Role.CUSTOMER), reviewController.deleteReview);

export const reviewRoute = router;
