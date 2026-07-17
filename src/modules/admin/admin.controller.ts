import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { adminService } from './admin.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status';

const getAllUsersByAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query;
        const result = await adminService.getAllUsersByAdminIntoDB(query);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'All Users retrieved successfully!',
            data: result,
        });
    },
);

const getSingleUsersByAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params?.id;
        const result = await adminService.getSingleUsersByAdminIntoDB(
            userId as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Single User retrieved successfully',
            data: result,
        });
    },
);

const updateUsersByAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const result = await adminService.updateUsersByAdminIntoDB(
            userId as string,
            req.body,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'User status updated successfully!!',
            data: result,
        });
    },
);

const adminDashboard = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await adminService.adminDashboardIntoDB();

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Admin Dashboard statistics retrieved successfully!',
            data: result,
        });
    },
);

export const adminController = {
    getAllUsersByAdmin,
    getSingleUsersByAdmin,
    updateUsersByAdmin,
    adminDashboard,
};
