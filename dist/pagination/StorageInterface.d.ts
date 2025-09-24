import { ColumnType } from "@/pagination/PaginatedTable";
export interface StorageInterface<T = unknown> {
    getConfigs(title: string | undefined, columns: ColumnType<T>[]): Promise<Record<string, {
        name: string;
        enabled: boolean;
    }[]>>;
    setConfigs(title: string, configs: Record<string, {
        name: string;
        enabled: boolean;
    }[]>): Promise<void>;
    getConfigName(title: string): Promise<string>;
    setConfigName(title: string, configName: string): Promise<void>;
    setDisplayAs(title: string, displayAs: "grid" | "list"): Promise<void>;
    getDisplayAs(title: string): Promise<"grid" | "list">;
    getConfig(title: string, columns: ColumnType<T>[]): Promise<{
        name: string;
        enabled: boolean;
    }[]>;
}
export declare class LocalStorage<T> implements StorageInterface<T> {
    setDisplayAs(title: string, displayAs: "grid" | "list"): Promise<void>;
    getDisplayAs(title: string): Promise<"grid" | "list">;
    getConfig(title: string | undefined, columns: ColumnType<T>[]): Promise<{
        name: string;
        enabled: boolean;
    }[]>;
    getConfigName(title: string): Promise<string>;
    getConfigs(title: string, columns: ColumnType<T>[]): Promise<Record<string, {
        name: string;
        enabled: boolean;
    }[]>>;
    setConfigName(title: string, configName: string): Promise<void>;
    setConfigs(title: string, configs: Record<string, {
        name: string;
        enabled: boolean;
    }[]>): Promise<void>;
}
//# sourceMappingURL=StorageInterface.d.ts.map