import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { paymentService } from './payment.service.js';
import { sendResponse } from '../../utils/sendResponse.js';
import httpStatus from 'http-status';
import { Role } from '../../../generated/prisma/enums.js';

const createCheckoutSession = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const orderId = req.body.orderId;

        if (!orderId) {
            throw new Error('orderId is required!');
        }

        const result =
            await paymentService.createCheckoutSessionIntoDB(orderId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Checkout completed successfully!',
            data: result,
        });
    },
);

const handleWebhook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature'] as string;

        await paymentService.handleWebhookIntoDB(event, signature as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Checkout completed successfully!',
            data: null,
        });
    },
);

const getMyPaymentHistory = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;

        const result = await paymentService.getMyPaymentHistoryIntoDB(
            userId as string,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'All Payment history retrieved successfully.',
            data: result,
        });
    },
);

const getSinglePaymentData = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = req.user?.id;
        const role = req.user?.role;

        const result = await paymentService.getSinglePaymentDataIntoDB(
            id as string,
            userId as string,
            role as Role,
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Single Payment retrieved successfully!',
            data: result,
        });
    },
);

export const paymentController = {
    createCheckoutSession,
    handleWebhook,
    getMyPaymentHistory,
    getSinglePaymentData,
};
