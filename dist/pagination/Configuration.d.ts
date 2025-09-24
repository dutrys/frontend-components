import { ColumnType } from "@/pagination/PaginatedTable";
import { StorageInterface } from "@/pagination/StorageInterface";
export declare const PaginationConfiguration: <T = unknown>({ name, configName, columns, setConfigName, store, disabled, configs: configsFromRemote, refresh, }: {
    disabled: boolean;
    setConfigName: (configName: string) => void;
    refresh: () => void;
    name: string;
    configName?: string;
    columns: ColumnType<T>[];
    store: StorageInterface<T>;
    configs: Record<string, {
        name: string;
        enabled: boolean;
    }[]> | undefined;
}) => import("react/jsx-runtime").JSX.Element;
export declare const OrderColumns: ({ name, items, setOrder, }: {
    name: string;
    items: {
        column: ColumnType<any>;
        enabled: boolean;
        name: string;
    }[];
    setOrder: (columns: {
        column: ColumnType<any>;
        enabled: boolean;
        name: string;
    }[]) => void;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Configuration.d.ts.map