import { Role } from '../../../generated/prisma/enums.js';

export interface IOrderItem {
    medicineId: string;
    quantity: number;
}

export interface ICreateOrder {
    shippingAddress: string;
    items: IOrderItem[];
}

export interface AuthRequest extends Request {
    user: {
        id: string;
        name: string;
        email: string;
        role: Role;
    };
}
