import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { paymentService } from './payment.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status';

const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const orderId = req.body.orderId

        if (!orderId) {
            throw new Error('orderId is required!')
        }

        const result = await paymentService.createCheckoutSessionIntoDB(orderId)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Checkout completed successfully!',
            data: result,
        });
    },
);

const handleWebhook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

const getMyPaymentHistory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

const getSinglePaymentData = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {},
);

export const paymentController = {
    createCheckoutSession,
    handleWebhook,
    getMyPaymentHistory,
    getSinglePaymentData,
};
