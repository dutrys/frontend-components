import { ColumnType } from "@/pagination/PaginatedTable";
import { StorageInterface } from "@/pagination/StorageInterface";
export declare const PaginationConfiguration: <T = unknown>({ name, configName, columns, setConfigName, store, configs: configsFromRemote, refresh, }: {
    setConfigName: (configName: string) => void;
    refresh: () => void;
    name: string;
    configName?: string;
    columns: ColumnType<T>[];
    store: StorageInterface<T>;
    configs: Record<string, {
        index: number;
        enabled: boolean;
    }[]> | undefined;
}) => import("react/jsx-runtime").JSX.Element;
export declare const OrderColumns: ({ name, items, setOrder, }: {
    name: string;
    items: {
        column: ColumnType<any>;
        enabled: boolean;
        index: number;
    }[];
    setOrder: (columns: {
        column: ColumnType<any>;
        enabled: boolean;
        index: number;
    }[]) => void;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Configuration.d.ts.map