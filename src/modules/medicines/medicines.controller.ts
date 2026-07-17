import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import pick from '../../utils/pick.js';
import { medicineFilterableFields } from './medicines.constant.js';
import { medicinesService } from './medicines.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

const getAllMedicines = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const filters = pick(req.query, medicineFilterableFields);

        const options = pick(req.query, [
            'page',
            'limit',
            'sortBy',
            'sortOrder',
        ]);

        const result = await medicinesService.getAllMedicinesIntoDB(
            filters,
            options,
        );

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Medicines retrieved successfully',
            data: result,
        });
    },
);

const getSingleMedicine = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await medicinesService.getSingleMedicineIntoDB(id as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Single Medicine retrieved successfully',
        data: result,
    });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await medicinesService.getAllCategoriesIntoDB();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'All Categories retrieved successfully!!!',
        data: result,
    });
});

export const medicinesController = {
    getAllMedicines,
    getSingleMedicine,
    getAllCategories,
};
