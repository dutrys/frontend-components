export type PaginateQuery<T> = {
    page?: number;
    limit?: number;
    sortBy?: T[];
    search?: string;
    [key: `filter.${string}`]: string;
};
//# sourceMappingURL=paginate.d.ts.map