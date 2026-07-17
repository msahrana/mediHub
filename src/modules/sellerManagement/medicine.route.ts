import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { Role } from '../../../generated/prisma/enums.js';
import { sellerManagementController } from './medicine.controller.js';

const router = Router();

router.post(
    '/medicines',
    auth(Role.SELLER),
    sellerManagementController.createMedicine,
);

router.get('/medicines', sellerManagementController.getAllMedicines);

router.get(
    '/medicines/:id',
    auth(Role.SELLER),
    sellerManagementController.getSingleMedicine,
);

router.patch(
    '/medicines/:id',
    auth(Role.SELLER),
    sellerManagementController.updateMedicine,
);

router.delete(
    '/medicines/:id',
    auth(Role.SELLER),
    sellerManagementController.deleteMedicine,
);

export const sellerManagementRoute = router;
