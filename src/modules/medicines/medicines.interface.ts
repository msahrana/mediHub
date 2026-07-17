export interface IMedicineFilterRequest {
    searchTerm?: string;
    categoryId?: string;
    sellerId?: string;
    minPrice?: string;
    maxPrice?: string;
}
export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
