import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { orderService } from './order.service.js';
import { orderFilterableFields } from './order.constant.js';
import pick from '../../utils/pick.js';
import strict from 'node:assert/strict';

const createOrder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await orderService.createOrderIntoDB(
            req.user?.id as string,
            req.body,
        );

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: 'Order created successfully!',
            data: result,
        });
    },
);

const getMyOrders = catchAsync(async (req, res) => {
    const customerId = req.user?.id;
    const result = await orderService.getMyOrdersIntoDB(customerId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'All Orders retrieved successfully',
        data: result,
    });
});

const getSingleOrder = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await orderService.getSingleOrderIntoDB(
        id as string,
        req.user?.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Single Order retrieved successfully',
        data: result,
    });
});

export const orderController = {
    createOrder,
    getMyOrders,
    getSingleOrder,
};
