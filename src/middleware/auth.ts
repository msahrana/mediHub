import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { jwtUtils } from '../utils/jwt';
import config from '../config';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from '../../generated/prisma/enums';
import { prisma } from '../lib/prisma';

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            };
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.cookies.accessToken
                ? req.cookies.accessToken
                : req.headers.authorization?.startsWith('Bearer')
                  ? req.headers.authorization?.split(' ')[1]
                  : req.headers.authorization;

            if (!token) {
                throw new Error(
                    'You are not logged in. Please log in to access this resource.',
                );
            }

            const verifyToken = jwtUtils.verifyToken(
                token,
                config.JWT_ACCESS_SECRET,
            );

            if (!verifyToken.success) {
                throw new Error(verifyToken.error);
            }

            const { name, email, role, id } = verifyToken.data as JwtPayload;

            if (!requiredRoles.length && !requiredRoles.includes(role)) {
                throw new Error(
                    "Forbidden. You don't have permission to access this resource.",
                );
            }

            const user = await prisma.user.findUnique({
                where: { name, email, role, id },
            });

            if (!user) {
                throw new Error('User not found. Please log in again!!!');
            }

            if (user.status === 'BANNED') {
                throw new Error(
                    'Your account has been blocked. Please contact support.',
                );
            }

            req.user = { name, email, role, id };

            next();
        },
    );
};
