import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { Role } from '../../../generated/prisma/enums.js';
import { medicineController } from './medicine.controller.js';

const router = Router();

router.post('/medicines', auth(Role.SELLER), medicineController.createMedicine);

router.get('/medicines', medicineController.getAllMedicines);

router.get(
    '/medicines/:id',
    auth(Role.SELLER),
    medicineController.getSingleMedicine,
);

router.patch(
    '/medicines/:id',
    auth(Role.SELLER),
    medicineController.updateMedicine,
);

router.delete(
    '/medicines/:id',
    auth(Role.SELLER),
    medicineController.deleteMedicine,
);

export const medicineRoute = router;
