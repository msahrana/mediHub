import { categoryController } from './category.controller.js';
import { Role } from '../../../generated/prisma/enums.js';
import { auth } from '../../middleware/auth.js';
import { Router } from 'express';

const router = Router();

router.post('/', auth(Role.ADMIN), categoryController.createCategory);

router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getSingleCategory);

router.patch('/:id', auth(Role.ADMIN), categoryController.updateCategory);

router.delete('/:id', auth(Role.ADMIN), categoryController.deleteCategory);

export const categoryRoute = router;
