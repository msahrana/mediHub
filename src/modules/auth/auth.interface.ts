import { Role } from '../../../generated/prisma/enums';

export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    role: Role;

    profile?: {
        fullName?: string;
        phone?: string;
        address?: string;
        city?: string;
        country?: string;
        image?: string;
    };
}

export interface ILoginUser {
    email: string;
    password: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}
