import { prisma } from '../../lib/prisma.js';
import { IMedicine } from './medicine.interface.js';

const createMedicineIntoDB = async (sellerId: string, payload: IMedicine) => {
    // Check Seller

    const seller = await prisma.user.findUnique({
        where: {
            id: sellerId,
        },
    });

    if (!seller) {
        throw new Error('Seller not found.');
    }

    // Check Category

    const category = await prisma.category.findUnique({
        where: {
            id: payload.categoryId,
        },
    });

    if (!category) {
        throw new Error('Category not found.');
    }

    // Create Medicine

    const result = await prisma.medicine.create({
        data: {
            name: payload.name,
            description: payload.description,
            manufacturer: payload.manufacturer,
            price: payload.price,
            stock: payload.stock,
            image: payload.image,
            sellerId,
            categoryId: payload.categoryId,
        },
        include: {
            category: true,
            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return result;
};

const getAllMedicinesFromDB = async (query: any) => {
    const {
        searchTerm,
        categoryId,
        manufacturer,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = query;

    const whereConditions: any = {};

    // Search
    if (searchTerm) {
        whereConditions.OR = [
            {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
            {
                manufacturer: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
        ];
    }

    // Category Filter
    if (categoryId) {
        whereConditions.categoryId = categoryId;
    }

    // Manufacturer Filter
    if (manufacturer) {
        whereConditions.manufacturer = {
            contains: manufacturer,
            mode: 'insensitive',
        };
    }

    // Price Filter
    if (minPrice || maxPrice) {
        whereConditions.price = {};

        if (minPrice) {
            whereConditions.price.gte = Number(minPrice);
        }

        if (maxPrice) {
            whereConditions.price.lte = Number(maxPrice);
        }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const result = await prisma.medicine.findMany({
        where: whereConditions,

        skip,

        take: Number(limit),

        orderBy: {
            [sortBy]: sortOrder,
        },

        include: {
            category: true,

            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    const total = await prisma.medicine.count({
        where: whereConditions,
    });

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },

        data: result,
    };
};

const getSingleMedicineFromDB = async (id: string) => {
    const result = await prisma.medicine.findUnique({
        where: {
            id,
        },

        include: {
            category: true,

            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            reviews: true,
        },
    });

    if (!result) {
        throw new Error('Medicine not found.');
    }

    return result;
};

const updateMedicineIntoDB = async (
    sellerId: string,
    medicineId: string,
    payload: Partial<IMedicine>,
) => {
    // Check medicine
    const medicine = await prisma.medicine.findUnique({
        where: {
            id: medicineId,
        },
    });

    if (!medicine) {
        throw new Error('Medicine not found.');
    }

    // Check ownership
    if (medicine.sellerId !== sellerId) {
        throw new Error('You are not authorized to update this medicine.');
    }

    // If category is changing, validate it
    if (payload.categoryId) {
        const category = await prisma.category.findUnique({
            where: {
                id: payload.categoryId,
            },
        });

        if (!category) {
            throw new Error('Category not found.');
        }
    }

    const result = await prisma.medicine.update({
        where: {
            id: medicineId,
        },

        data: {
            ...payload,
        },

        include: {
            category: true,

            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return result;
};

const deleteMedicineIntoDB = async (sellerId: string, medicineId: string) => {
    const medicine = await prisma.medicine.findUnique({
        where: {
            id: medicineId,
        },
    });

    if (!medicine) {
        throw new Error('Medicine not found.');
    }

    // Ensure the seller owns this medicine
    if (medicine.sellerId !== sellerId) {
        throw new Error('You are not authorized to delete this medicine.');
    }

    await prisma.medicine.delete({
        where: {
            id: medicineId,
        },
    });

    return null;
};

export const sellerManagementService = {
    createMedicineIntoDB,
    getAllMedicinesFromDB,
    getSingleMedicineFromDB,
    updateMedicineIntoDB,
    deleteMedicineIntoDB,
};
