import { prisma } from '../../lib/prisma.js';
import { ICreateOrder } from './order.interface.js';

const createOrderIntoDB = async (customerId: string, payload: ICreateOrder) => {
    const { shippingAddress, items } = payload;

    if (!items || items.length === 0) {
        throw new Error('Order items cannot be empty.');
    }

    let totalPrice = 0;

    const orderItems: {
        medicineId: string;
        sellerId: string;
        quantity: number;
        price: number;
    }[] = [];

    // Validate medicines & calculate total
    for (const item of items) {
        const medicine = await prisma.medicine.findUnique({
            where: {
                id: item.medicineId,
            },
        });

        if (!medicine) {
            throw new Error(`Medicine not found: ${item.medicineId}`);
        }

        if (medicine.stock <= 0) {
            throw new Error(`${medicine.name} is out of stock.`);
        }

        if (medicine.stock < item.quantity) {
            throw new Error(
                `${medicine.name} has only ${medicine.stock} items available.`,
            );
        }

        totalPrice += medicine.price * item.quantity;

        orderItems.push({
            medicineId: medicine.id,
            sellerId: medicine.sellerId,
            quantity: item.quantity,
            price: medicine.price,
        });
    }

    // Transaction
    const order = await prisma.$transaction(async (tx: any) => {
        // Create Order
        const createdOrder = await tx.order.create({
            data: {
                customerId,
                shippingAddress,
                totalPrice,
            },
        });

        // Create Order Items
        await tx.orderItem.createMany({
            data: orderItems.map((item) => ({
                orderId: createdOrder.id,
                medicineId: item.medicineId,
                sellerId: item.sellerId,
                quantity: item.quantity,
                price: item.price,
            })),
        });

        // Update Stock
        for (const item of orderItems) {
            await tx.medicine.update({
                where: {
                    id: item.medicineId,
                },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        // Remove ordered medicines from cart
        await tx.cart.deleteMany({
            where: {
                customerId,
                medicineId: {
                    in: orderItems.map((item) => item.medicineId),
                },
            },
        });

        // Return Order Details
        const result = await tx.order.findUnique({
            where: {
                id: createdOrder.id,
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        medicine: true,
                        seller: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });

        return result;
    });

    return order;
};

const getMyOrdersIntoDB = async (customerId: string) => {
    const orders = await prisma.order.findMany({
        where: {
            customerId,
        },

        include: {
            items: {
                include: {
                    medicine: {
                        select: {
                            id: true,
                            name: true,
                            manufacturer: true,
                            image: true,
                            price: true,
                        },
                    },

                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },

            payment: true,
        },

        orderBy: {
            createdAt: 'desc',
        },
    });

    return orders;
};

const getSingleOrderIntoDB = async (orderId: string, customerId: string) => {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            customerId,
        },

        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            items: {
                include: {
                    medicine: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            manufacturer: true,
                            image: true,
                            price: true,
                        },
                    },

                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },

            payment: true,
        },
    });

    if (!order) {
        throw new Error('Order not found');
    }

    return order;
};

export const orderService = {
    createOrderIntoDB,
    getMyOrdersIntoDB,
    getSingleOrderIntoDB,
};
