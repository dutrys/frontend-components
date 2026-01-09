import { ColumnType } from "./PaginatedTable";
export interface PaginationSettings {
    loadByDefault?: string;
    displayAs?: string;
    columns?: Record<string, {
        name: string;
        enabled: boolean;
    }[]>;
}
export interface StorageInterface<T = unknown> {
    getConfig(title: string, columns: ColumnType<T>[]): Promise<PaginationSettings>;
    setConfig(title: string, configs: PaginationSettings): Promise<void>;
}
export declare class LocalStorage<T> implements StorageInterface<T> {
    getConfig(title: string, columns: ColumnType<T>[]): Promise<PaginationSettings>;
    setConfig(title: string, configs: PaginationSettings): Promise<void>;
}
//# sourceMappingURL=StorageInterface.d.ts.map