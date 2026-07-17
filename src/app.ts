import cookieParser from 'cookie-parser';
import { Application } from 'express';
import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import { authRoute } from './modules/auth/auth.route.js';
import { categoryRoute } from './modules/categories/category.route.js';
import { sellerManagementRoute } from './modules/sellerManagement/medicine.route.js';
import { notFound } from './middleware/notFound.js';
import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import { medicinesRoute } from './modules/medicines/medicines.route.js';
import { orderRoute } from './modules/orders/order.route.js';
import { reviewRoute } from './modules/review/review.route.js';
import { adminRoute } from './modules/admin/admin.route.js';
import { paymentRoute } from './modules/payment/payment.route.js';

const app: Application = express();

app.use(
    cors({
        origin: config.APP_URL,
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Dear Customer, Welcome Our MediHub Medicine Store!');
});

app.use('/api/auth', authRoute);
app.use('/api/category', categoryRoute);
app.use('/api/seller', sellerManagementRoute);
app.use('/api', medicinesRoute);
app.use('/api/orders', orderRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/admin', adminRoute);
app.use('/api/payments', paymentRoute);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
