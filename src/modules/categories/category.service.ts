import { ICategory } from "./category.interface.js";
import { prisma } from "../../lib/prisma.js";


const createCategoryIntoDB = async (payload: ICategory) => {
    const isCategoryExist = await prisma.category.findUnique({
        where: {
            name: payload.name,
        },
    });

    if (isCategoryExist) {
        throw new Error('Category already exists.');
    }

    const result = await prisma.category.create({
        data: payload,
    });

    return result;
};

const getAllCategoriesFromDB = async () => {
    const result = await prisma.category.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return result;
};

const getSingleCategoryFromDB = async (id: string) => {
    const result = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!result) {
        throw new Error('Category not found.');
    }

    return result;
};

const updateCategoryIntoDB = async (
    id: string,
    payload: Partial<ICategory>,
) => {
    const isCategoryExist = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!isCategoryExist) {
        throw new Error('Category not found.');
    }

    if (payload.name) {
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                name: payload.name,
                NOT: {
                    id,
                },
            },
        });

        if (duplicateCategory) {
            throw new Error('Category name already exists.');
        }
    }

    const result = await prisma.category.update({
        where: {
            id,
        },
        data: payload,
    });

    return result;
};

const deleteCategoryFromDB = async (id: string) => {
    const isCategoryExist = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!isCategoryExist) {
        throw new Error('Category not found.');
    }

    await prisma.category.delete({
        where: {
            id,
        },
    });

    return null;
};

export const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getSingleCategoryFromDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB,
};
