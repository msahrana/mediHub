import { UserStatus } from '../../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';

const getAllUsersByAdminIntoDB = async (query: Record<string, any>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
        searchTerm,
        role,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = query;

    const where: any = {};

    if (searchTerm) {
        where.OR = [
            {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
            {
                email: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
        ];
    }

    if (role) {
        where.role = role;
    }

    if (status) {
        where.status = status;
    }

    const users = await prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    const total = await prisma.user.count({
        where,
    });

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: users,
    };
};

const getSingleUsersByAdminIntoDB = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            profile: true, // Remove if you don't have a Profile model
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

const updateUsersByAdminIntoDB = async (
    userId: string,
    payload: { status: UserStatus },
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: payload.status,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

const adminDashboardIntoDB = async () => {
    const [
        // Users
        totalUsers,
        totalCustomers,
        totalSellers,
        totalAdmins,
        activeUsers,
        bannedUsers,

        // Medicines
        totalMedicines,
        inStockMedicines,
        outOfStockMedicines,

        // Categories
        totalCategories,

        // Cart
        totalCartItems,
        activeCarts,
        cartQuantity,

        // Orders
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,

        // Payments
        totalPayments,
        pendingPayments,
        completedPayments,
        failedPayments,
        refundedPayments,

        // Revenue
        revenue,
    ] = await Promise.all([
        // Users
        prisma.user.count(),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.user.count({ where: { role: 'SELLER' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),

        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.user.count({ where: { status: 'BANNED' } }),

        // Medicines
        prisma.medicine.count(),
        prisma.medicine.count({
            where: {
                stock: {
                    gt: 0,
                },
            },
        }),
        prisma.medicine.count({
            where: {
                stock: 0,
            },
        }),

        // Categories
        prisma.category.count(),

        // Cart
        prisma.cart.count(),

        prisma.cart.groupBy({
            by: ['customerId'],
        }),

        prisma.cart.aggregate({
            _sum: {
                quantity: true,
            },
        }),

        // Orders
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { status: 'PROCESSING' } }),
        prisma.order.count({ where: { status: 'SHIPPED' } }),
        prisma.order.count({ where: { status: 'DELIVERED' } }),
        prisma.order.count({ where: { status: 'CANCELLED' } }),

        // Payments
        prisma.payment.count(),
        prisma.payment.count({ where: { status: 'PENDING' } }),
        prisma.payment.count({ where: { status: 'COMPLETED' } }),
        prisma.payment.count({ where: { status: 'FAILED' } }),
        prisma.payment.count({ where: { status: 'REFUNDED' } }),

        // Revenue
        prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: 'COMPLETED',
            },
        }),
    ]);

    return {
        users: {
            totalUsers,
            totalCustomers,
            totalSellers,
            totalAdmins,
            activeUsers,
            bannedUsers,
        },

        medicines: {
            totalMedicines,
            inStockMedicines,
            outOfStockMedicines,
        },

        categories: {
            totalCategories,
        },

        carts: {
            totalCartItems,
            activeCarts: activeCarts.length,
            totalQuantity: cartQuantity._sum.quantity ?? 0,
        },

        orders: {
            totalOrders,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
        },

        payments: {
            totalPayments,
            pendingPayments,
            completedPayments,
            failedPayments,
            refundedPayments,
            totalRevenue: revenue._sum.amount ?? 0,
        },
    };
};

export const adminService = {
    getAllUsersByAdminIntoDB,
    getSingleUsersByAdminIntoDB,
    updateUsersByAdminIntoDB,
    adminDashboardIntoDB,
};
