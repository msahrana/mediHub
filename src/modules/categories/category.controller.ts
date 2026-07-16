import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { categoryService } from './category.service';
import { sendResponse } from '../../utils/sendResponse';

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await categoryService.createCategoryIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Category created successfully.',
        data: result,
    });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategoriesFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Categories retrieved successfully.',
        data: result,
    });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getSingleCategoryFromDB(
        req.params.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Single Category retrieved successfully.',
        data: result,
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.updateCategoryIntoDB(
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Category updated successfully.',
        data: result,
    });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await categoryService.deleteCategoryFromDB(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Category deleted successfully.',
        data: null,
    });
});

export const categoryController = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
