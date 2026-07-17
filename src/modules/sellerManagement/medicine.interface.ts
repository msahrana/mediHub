export interface IMedicine {
    name: string;
    description: string;
    manufacturer: string;
    price: number;
    stock: number;
    image?: string;
    categoryId: string;
}
