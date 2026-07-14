import { ILoginUser, IRegisterUser } from './auth.interface';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { Role } from '../../../generated/prisma/enums';
import { jwtUtils } from '../../utils/jwt';
import { prisma } from '../../lib/prisma';
import config from '../../config';
import bcrypt from 'bcryptjs';

const registerUserIntoDB = async (payload: IRegisterUser) => {
    // Get user field from payload
    const { name, email, password, role, profile } = payload;

    // Check if user already exists
    const isUserExist = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExist) {
        throw new Error('User with this email already exists!');
    }

    // Prevent admin registration
    if (role === Role.ADMIN) {
        throw new Error('You cannot register as ADMIN.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.BCRYPT_SALT_ROUNDS),
    );

    // Create user
    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            profile: {
                create: {
                    fullName: profile?.fullName || name,
                    phone: profile?.phone,
                    address: profile?.address,
                    city: profile?.city,
                    country: profile?.country,
                    image: profile?.image,
                },
            },
        },
        include: {
            profile: true,
        },
    });

    // Return user without password
    const newUser = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
        },
        omit: {
            password: true,
        },
        include: {
            profile: true,
        },
    });

    return newUser;
};

const loginUserIntoDB = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.status === 'BANNED') {
        throw new Error(
            'Your account has been BANNED. Please contact support.',
        );
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error('Password not matched!');
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.JWT_ACCESS_SECRET,
        config.JWT_ACCESS_EXPIRES_IN as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.JWT_REFRESH_SECRET,
        config.JWT_REFRESH_EXPIRES_IN as SignOptions,
    );

    return { user, accessToken, refreshToken };
};

const refreshTokenIntoDB = async (refreshToken: string) => {
    const verifyRefreshToken = jwtUtils.verifyToken(
        refreshToken,
        config.JWT_REFRESH_SECRET,
    );

    if (!verifyRefreshToken) {
        throw new Error('verifyRefreshToken.errors');
    }

    const { id } = verifyRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (user.status === 'BANNED') {
        throw new Error('User is BANNED !!!');
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.JWT_ACCESS_SECRET,
        config.JWT_ACCESS_EXPIRES_IN as SignOptions,
    );

    return { accessToken };
};

const getMyProfileIntoDB = async (userId: string) => {
    const userProfile = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        omit: {
            password: true,
        },
        include: {
            profile: true,
        },
    });

    return userProfile;
};

const getAllUsersIntoDB = async () => {};

const updateMyProfileIntoDB = async () => {};

const changePasswordIntoDB = async () => {};

export const authService = {
    registerUserIntoDB,
    loginUserIntoDB,
    refreshTokenIntoDB,
    getMyProfileIntoDB,
    getAllUsersIntoDB,
    updateMyProfileIntoDB,
    changePasswordIntoDB,
};
