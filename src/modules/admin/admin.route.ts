import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { auth } from '../../middleware/auth.js';
import { Role } from '../../../generated/prisma/enums.js';

const router = Router();

router.get('/users', auth(Role.ADMIN), adminController.getAllUsersByAdmin);
router.get('/users/:id', auth(Role.ADMIN), adminController.getSingleUsersByAdmin);
router.patch('/users/:id', auth(Role.ADMIN), adminController.updateUsersByAdmin);
router.get('/dashboard',auth(Role.ADMIN),adminController.adminDashboard)

export const adminRoute = router;
