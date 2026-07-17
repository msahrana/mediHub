import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { reviewService } from './review.service.js';
import { sendResponse } from '../../utils/sendResponse.js';

const createReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await reviewService.createReviewIntoDB(
            req.user!.id,
            req.body,
        );

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: 'Review created successfully!',
            data: result,
        });
    },
);

const getAllReviews = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await reviewService.getAllReviewsIntoDB();

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'All Reviews retrieved successfully',
            data: result,
        });
    },
);

const getSingleReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const result = await reviewService.getSingleReviewIntoDB(id as string);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Single Review retrieved successfully',
            data: result,
        });
    },
);

const updateReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const reviewId = req.params?.id;

        const result = await reviewService.updateReviewIntoDB(
            reviewId as string,
            req.body,
        );

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Review updated successfully',
            data: result,
        });
    },
);

const deleteReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const reviewId = req.params.id;
        await reviewService.deleteReviewIntoDB(reviewId as string);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Review deleted successfully!!!',
            data: null,
        });
    },
);

export const reviewController = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
};
