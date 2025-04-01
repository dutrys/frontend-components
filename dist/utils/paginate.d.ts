export type PaginateQuery<T> = {
    page?: number;
    limit?: number;
    sortBy?: T[];
    search?: string;
    [key: `filter.${string}`]: string;
};
export type ResponseMeta = {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
};
export declare const getPreviousPageParam: <T extends {
    meta: ResponseMeta;
}>(page?: T) => number | undefined;
export declare const getNextPageParam: <T extends {
    meta: ResponseMeta;
}>(page?: T) => number | undefined;
//# sourceMappingURL=paginate.d.ts.map