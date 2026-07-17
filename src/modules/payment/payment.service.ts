import config from '../../config/index.js';
import { prisma } from '../../lib/prisma.js';
import { stripe } from '../../lib/stripe.js';

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

    // Save Payment Record
    await prisma.payment.upsert({
        where: {
            orderId: order.id,
        },

        update: {
            stripeCustomerId,
            checkoutSessionId: session.id,
        },

        create: {
            orderId: order.id,
            userId: order.customer.id,

            transactionId: crypto.randomUUID(),

            amount: order.totalPrice,

            method: 'STRIPE',

            status: 'PENDING',

            stripeCustomerId,

            checkoutSessionId: session.id,
        },
    });

    return {
        paymentUrl: session.url,
    };
};

const handleWebhookIntoDB = async () => {};

const getMyPaymentHistoryIntoDB = async () => {};

const getSinglePaymentDataIntoDB = async () => {};

export const paymentService = {
    createCheckoutSessionIntoDB,
    handleWebhookIntoDB,
    getMyPaymentHistoryIntoDB,
    getSinglePaymentDataIntoDB,
};
