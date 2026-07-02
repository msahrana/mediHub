import { Application } from 'express';
import express from 'express';
import cors from 'cors';
import config from './config';
import cookieParser from 'cookie-parser';
import { userRoute } from './modules/users/user.route';

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

app.use('/api/users', userRoute);

export default app;
