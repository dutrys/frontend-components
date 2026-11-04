import { ResponseMeta } from "../utils/paginate";
import { ColumnType } from "./PaginatedTable";
export declare const PaginatedTableClient: <TModel extends {
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}, TSort extends Record<string, string> = Record<string, string>>({ data, isLoading, columns, sortEnum, }: {
    isLoading: boolean;
    sortEnum: TSort;
    data: TModel | undefined;
    columns: Array<ColumnType<TModel["data"][number]>>;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PaginatedTableClient.d.ts.map