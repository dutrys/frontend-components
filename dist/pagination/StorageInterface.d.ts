import { ColumnType } from "@/pagination/PaginatedTable";
export interface StorageInterface<T = unknown> {
    getConfigs(title: string | undefined, columns: ColumnType<T>[]): Promise<Record<string, {
        index: number;
        enabled: boolean;
    }[]>>;
    setConfigs(title: string, configs: Record<string, {
        index: number;
        enabled: boolean;
    }[]>): Promise<void>;
    getConfigName(title: string): Promise<string>;
    setConfigName(title: string, configName: string): Promise<void>;
    getConfig(title: string, columns: ColumnType<T>[]): Promise<{
        index: number;
        enabled: boolean;
    }[]>;
}
export declare class LocalStorage<T> implements StorageInterface<T> {
    getConfig(title: string | undefined, columns: ColumnType<T>[]): Promise<{
        index: number;
        enabled: boolean;
    }[]>;
    getConfigName(title: string): Promise<string>;
    getConfigs(title: string, columns: ColumnType<T>[]): Promise<Record<string, {
        index: number;
        enabled: boolean;
    }[]>>;
    setConfigName(title: string, configName: string): Promise<void>;
    setConfigs(title: string, configs: Record<string, {
        index: number;
        enabled: boolean;
    }[]>): Promise<void>;
}
//# sourceMappingURL=StorageInterface.d.ts.map