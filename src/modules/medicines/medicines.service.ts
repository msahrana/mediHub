import { prisma } from '../../lib/prisma.js';
import { medicineSearchableFields } from './medicines.constant.js';
import {
    IMedicineFilterRequest,
    IPaginationOptions,
} from './medicines.interface.js';

const getAllMedicinesIntoDB = async (
    filters: IMedicineFilterRequest,
    options: IPaginationOptions,
) => {
    const { searchTerm, minPrice, maxPrice, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: medicineSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([key, value]) => ({
                [key]: value,
            })),
        });
    }

    if (minPrice) {
        andConditions.push({
            price: {
                gte: Number(minPrice),
            },
        });
    }

    if (maxPrice) {
        andConditions.push({
            price: {
                lte: Number(maxPrice),
            },
        });
    }

    const whereConditions =
        andConditions.length > 0
            ? {
                  AND: andConditions,
              }
            : {};

    // pagination and searching
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    const medicines = await prisma.medicine.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            sortBy && sortOrder
                ? {
                      [sortBy]: sortOrder,
                  }
                : {
                      createdAt: 'desc',
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
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },

        data: medicines,
    };
};

const getSingleMedicineIntoDB = async (id: string) => {
    const medicine = await prisma.medicine.findUnique({
        where: { id },
        include: {
            category: true,
            seller: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            reviews: {
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    if (!medicine) {
        throw new Error('Medicine not found');
    }

    return medicine;
};

const getAllCategoriesIntoDB = async () => {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    return categories;
};

export const medicinesService = {
    getAllMedicinesIntoDB,
    getSingleMedicineIntoDB,
    getAllCategoriesIntoDB,
};
