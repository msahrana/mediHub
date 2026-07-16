import { Role } from '../../../generated/prisma/enums';
import { authController } from './auth.controller';
import { auth } from '../../middleware/auth';
import { Router } from 'express';

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refresh-token', authController.refreshToken);
router.get(
    '/me',
    auth(Role.ADMIN, Role.CUSTOMER, Role.SELLER),
    authController.getMyProfile,
);
router.get('/', auth(Role.ADMIN), authController.getAllUsers);
router.put(
    '/my-profile',
    auth(Role.ADMIN, Role.CUSTOMER, Role.SELLER),
    authController.updateMyProfile,
);
router.patch(
    '/change-password',
    auth(Role.ADMIN, Role.CUSTOMER, Role.SELLER),
    authController.changePassword,
);

export const authRoute = router;
