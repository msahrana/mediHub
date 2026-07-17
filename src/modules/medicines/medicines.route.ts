import { Router } from 'express';
import { medicinesController } from './medicines.controller.js';

const router = Router();

router.get('/medicines', medicinesController.getAllMedicines);
router.get('/medicines/:id', medicinesController.getSingleMedicine);
router.get('/categories', medicinesController.getAllCategories);

export const medicinesRoute = router;
