import { ReadonlyURLSearchParams } from "next/navigation";
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
    sortBy: string[][];
};
export declare const getPreviousPageParam: <T extends {
    meta: ResponseMeta;
}>(page?: T) => number | undefined;
export declare const getNextPageParam: <T extends {
    meta: ResponseMeta;
}>(page?: T) => number | undefined;
export declare const setPartialParams: (partialParams: Record<string, any>, searchParams: ReadonlyURLSearchParams | null) => string;
export declare const isParamActive: (link: Record<string, string>, searchParams: ReadonlyURLSearchParams) => boolean;
//# sourceMappingURL=paginate.d.ts.map