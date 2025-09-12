import { ColumnType } from "@/pagination/columnTypes";
export declare const PaginationConfiguration: ({ title, columns, setConfig, }: {
    setConfig: (config: {
        index: number;
        checked: boolean;
    }[]) => void;
    title: string;
    columns: ColumnType<any>[];
}) => import("react/jsx-runtime").JSX.Element;
export declare const OrderColumns: ({ name, items, setOrder, }: {
    name: string;
    items: {
        column: ColumnType<any>;
        checked: boolean;
        index: number;
    }[];
    setOrder: (columns: {
        column: ColumnType<any>;
        checked: boolean;
        index: number;
    }[]) => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare function getPaginationConfigs<TModel = any>(configName: string | undefined, columns: ColumnType<TModel>[]): {
    index: number;
    checked: boolean;
}[];
//# sourceMappingURL=Configuration.d.ts.map