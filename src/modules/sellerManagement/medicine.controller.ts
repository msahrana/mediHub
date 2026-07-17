import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync.js';
import { sellerManagementService } from './medicine.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

const createMedicine = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const sellerId = req.user?.id;

        const result = await sellerManagementService.createMedicineIntoDB(
            sellerId as string,
            req.body,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'Medicine created successfully.',
            data: result,
        });
    },
);

const getAllMedicines = catchAsync(async (req, res) => {
    const result = await sellerManagementService.getAllMedicinesFromDB(
        req.query,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All Medicines retrieved successfully.',
        meta: result.meta,
        data: result.data,
    });
});

const getSingleMedicine = catchAsync(async (req, res) => {
    const result = await sellerManagementService.getSingleMedicineFromDB(
        req.params.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Medicine retrieved successfully.',
        data: result,
    });
});

const updateMedicine = catchAsync(async (req, res) => {
    const sellerId = req.user?.id;

    const result = await sellerManagementService.updateMedicineIntoDB(
        sellerId as string,
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Medicine updated successfully.',
        data: result,
    });
});

const deleteMedicine = catchAsync(async (req, res) => {
    const sellerId = req.user?.id as string;

    await sellerManagementService.deleteMedicineIntoDB(
        sellerId,
        req.params.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Medicine deleted successfully.',
        data: null,
    });
});

export const sellerManagementController = {
    createMedicine,
    getAllMedicines,
    getSingleMedicine,
    updateMedicine,
    deleteMedicine,
};
