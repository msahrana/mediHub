import { globalErrorHandler } from './middleware/globalErrorHandler';
import { authRoute } from './modules/auth/auth.route';
import { notFound } from './middleware/notFound';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import express from 'express';
import config from './config';
import cors from 'cors';
import { categoryRoute } from './modules/categories/category.route';

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

app.use(notFound);
app.use(globalErrorHandler);

export default app;
