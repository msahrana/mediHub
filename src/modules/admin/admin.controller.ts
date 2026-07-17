import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';

const getAllUsersByAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

const getSingleUsersByAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteUsersByAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

const adminDashboard = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

export const adminController = {
    getAllUsersByAdmin,
    getSingleUsersByAdmin,
    deleteUsersByAdmin,
    adminDashboard,
};
