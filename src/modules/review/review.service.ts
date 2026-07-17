import { prisma } from '../../lib/prisma.js';
import { ICreateReview } from './review.interface.js';

const createReviewIntoDB = async (
    customerId: string,
    payload: ICreateReview,
) => {
    const { medicineId, rating, comment } = payload;

    // Rating validation
    if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5.');
    }

    // Check medicine exists
    const medicine = await prisma.medicine.findUnique({
        where: {
            id: medicineId,
        },
    });

    if (!medicine) {
        throw new Error('Medicine not found.');
    }

    // Check customer purchased the medicine
    const purchasedMedicine = await prisma.orderItem.findFirst({
        where: {
            medicineId,
            order: {
                customerId,
            },
        },
    });

    if (!purchasedMedicine) {
        throw new Error('You can review only medicines you have purchased.');
    }

    // Prevent duplicate review
    const existingReview = await prisma.review.findUnique({
        where: {
            medicineId_customerId: {
                medicineId,
                customerId,
            },
        },
    });

    if (existingReview) {
        throw new Error('You have already reviewed this medicine.');
    }

    // Create review
    const review = await prisma.review.create({
        data: {
            rating,
            comment,
            medicineId,
            customerId,
        },

        include: {
            medicine: {
                select: {
                    id: true,
                    name: true,
                    manufacturer: true,
                    image: true,
                },
            },

            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return review;
};

const getAllReviewsIntoDB = async () => {
    const reviews = await prisma.review.findMany({
        include: {
            medicine: {
                select: {
                    id: true,
                    name: true,
                    manufacturer: true,
                    image: true,
                },
            },

            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },

        orderBy: {
            createdAt: 'desc',
        },
    });

    return reviews;
};

const getSingleReviewIntoDB = async (medicineId: string) => {
    const medicine = await prisma.medicine.findUnique({
        where: {
            id: medicineId,
        },
    });

    if (!medicine) {
        throw new Error('Medicine not found.');
    }

    const reviews = await prisma.review.findMany({
        where: {
            medicineId,
        },

        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },

        orderBy: {
            createdAt: 'desc',
        },
    });

    return reviews;
};

const updateReviewIntoDB = async (
    reviewId: string,

    payload: {
        rating?: number;
        comment?: string;
    },
) => {
    const review = await prisma.review.findFirst({
        where: {
            id: reviewId,
        },
    });
    console.log('Review ID:', reviewId);

    if (!review) {
        throw new Error('Review not found.');
    }

    if (
        payload.rating !== undefined &&
        (payload.rating < 1 || payload.rating > 5)
    ) {
        throw new Error('Rating must be between 1 and 5.');
    }

    const updatedReview = await prisma.review.update({
        where: {
            id: reviewId,
        },

        data: {
            rating: payload.rating,
            comment: payload.comment,
        },

        include: {
            medicine: {
                select: {
                    id: true,
                    name: true,
                },
            },

            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return updatedReview;
};

const deleteReviewIntoDB = async (reviewId: string) => {
    const review = await prisma.review.findFirst({
        where: {
            id: reviewId,
        },
    });

    if (!review) {
        throw new Error('Review not found.');
    }

    await prisma.review.delete({
        where: {
            id: reviewId,
        },
    });

    return null;
};

export const reviewService = {
    createReviewIntoDB,
    getAllReviewsIntoDB,
    getSingleReviewIntoDB,
    updateReviewIntoDB,
    deleteReviewIntoDB,
};
