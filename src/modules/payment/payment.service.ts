import Stripe from 'stripe';
import config from '../../config/index.js';
import { prisma } from '../../lib/prisma.js';
import { stripe } from '../../lib/stripe.js';
import {
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
    Role,
} from '../../../generated/prisma/enums.js';

const createCheckoutSessionIntoDB = async (orderId: string) => {
    const order = await prisma.order.findUniqueOrThrow({
        where: {
            id: orderId,
        },
        include: {
            customer: true,
            payment: true,
            items: {
                include: {
                    medicine: true,
                },
            },
        },
    });

    let stripeCustomerId = order.payment?.stripeCustomerId;

    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            name: order.customer.name,
            email: order.customer.email,
            metadata: {
                userId: order.customer.id,
                orderId: order.id,
            },
        });
        stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',

        customer: stripeCustomerId,

        payment_method_types: ['card'],

        line_items: order.items.map((item: any) => ({
            quantity: item.quantity,

            price_data: {
                currency: 'usd',

                unit_amount: Math.round(item.price * 100),

                product_data: {
                    name: item.medicine.name,
                    description: item.medicine.description,
                    images: item.medicine.image ? [item.medicine.image] : [],
                },
            },
        })),

        success_url: `${config.APP_URL}/payment-success`,

        cancel_url: `${config.APP_URL}/payment-cancel`,

        metadata: {
            orderId: order.id,
            userId: order.customer.id,
        },
    });

    // ** Save Payment Record: start **
    // await prisma.payment.upsert({
    //     where: {
    //         orderId: order.id,
    //     },

    //     update: {
    //         stripeCustomerId,
    //         checkoutSessionId: session.id,
    //     },

    //     create: {
    //         orderId: order.id,
    //         userId: order.customer.id,

    //         transactionId: crypto.randomUUID(),

    //         amount: order.totalPrice,

    //         method: 'STRIPE',

    //         status: 'PENDING',

    //         stripeCustomerId,

    //         checkoutSessionId: session.id,
    //     },
    // });
    // ** Save Payment Record: end **

    return {
        paymentUrl: session.url,
    };
};

const handleWebhookIntoDB = async (payload: Buffer, signature: string) => {
    const endpointSecret = config.STRIPE_WEBHOOK_SECRET;

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret,
    );

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;
            const userId = session.metadata?.userId;

            if (!orderId || !userId) {
                throw new Error('Webhook metadata is missing.');
            }

            const paymentIntentId = session.payment_intent as string;
            const stripeCustomerId = session.customer as string;

            // Retrieve the full PaymentIntent object
            const paymentIntent =
                await stripe.paymentIntents.retrieve(paymentIntentId);

            // Retrieve Payment Intent from Stripe
            await prisma.payment.upsert({
                where: {
                    orderId,
                },

                update: {
                    status: PaymentStatus.COMPLETED,
                    paidAt: new Date(),
                    paymentIntentId,
                    checkoutSessionId: session.id,
                    stripeCustomerId,
                    transactionId: paymentIntent.id,
                },

                create: {
                    orderId,
                    userId,
                    amount: paymentIntent.amount / 100, // Stripe amount is in cents
                    method: PaymentMethod.STRIPE,
                    status: PaymentStatus.COMPLETED,
                    paidAt: new Date(),
                    paymentIntentId,
                    checkoutSessionId: session.id,
                    stripeCustomerId,
                    transactionId: paymentIntent.id,
                },
            });

            await prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    status: OrderStatus.PROCESSING,
                },
            });

            console.log(`Payment completed successfully for Order: ${orderId}`);

            break;
        }

        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            console.log('Payment Intent:', paymentIntent.id);

            const orderId = paymentIntent.metadata.orderId;

            if (!orderId) {
                console.log('No orderId in payment intent metadata.');
                break;
            }

            await prisma.payment.update({
                where: {
                    orderId,
                },
                data: {
                    status: PaymentStatus.COMPLETED,
                    paymentIntentId: paymentIntent.id,
                    transactionId: paymentIntent.id,
                    paidAt: new Date(),
                },
            });

            await prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    status: OrderStatus.PROCESSING,
                },
            });

            console.log('Payment Intent updated.');

            break;
        }

        case 'checkout.session.expired': {
            const session = event.data.object as Stripe.Checkout.Session;

            const orderId = session.metadata?.orderId;

            if (orderId) {
                await prisma.payment.updateMany({
                    where: {
                        orderId,
                    },
                    data: {
                        status: 'FAILED',
                    },
                });
            }

            console.log(`Checkout expired for Order: ${orderId}`);

            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            await prisma.payment.updateMany({
                where: {
                    paymentIntentId: paymentIntent.id,
                },
                data: {
                    status: PaymentStatus.FAILED,
                },
            });
            console.log(`Payment failed: ${paymentIntent.id}`);

            break;
        }

        case 'charge.succeeded':
            console.log('Charge succeeded.');
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
            break;
    }

    return {
        received: true,
    };
};

const getMyPaymentHistoryIntoDB = async (userId: string) => {
    const payments = await prisma.payment.findMany({
        where: {
            userId,
        },
        include: {
            order: {
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
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return payments;
};

const getSinglePaymentDataIntoDB = async (
    paymentId: string,
    userId: string,
    role: Role,
) => {
    const payment = await prisma.payment.findUniqueOrThrow({
        where: {
            id: paymentId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            order: {
                include: {
                    items: {
                        include: {
                            medicine: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                    manufacturer: true,
                                    price: true,
                                    stock: true,
                                    image: true,
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
                },
            },
        },
    });

    // Only the owner or an admin can view the payment
    if (role !== Role.ADMIN && payment.userId !== userId) {
        throw new Error('You are not authorized to view this payment.');
    }

    return payment;
};

export const paymentService = {
    createCheckoutSessionIntoDB,
    handleWebhookIntoDB,
    getMyPaymentHistoryIntoDB,
    getSinglePaymentDataIntoDB,
};
