import { ColumnType } from "@/pagination/PaginatedTable";

export interface StorageInterface<T = unknown> {
  getConfigs(
    title: string | undefined,
    columns: ColumnType<T>[],
  ): Promise<Record<string, { index: number; enabled: boolean }[]>>;
  setConfigs(title: string, configs: Record<string, { index: number; enabled: boolean }[]>): Promise<void>;
  getConfigName(title: string): Promise<string>;
  setConfigName(title: string, configName: string): Promise<void>;
  getConfig(title: string, columns: ColumnType<T>[]): Promise<{ index: number; enabled: boolean }[]>;
}

export class LocalStorage<T> implements StorageInterface<T> {
  async getConfig(title: string | undefined, columns: ColumnType<T>[]): Promise<{ index: number; enabled: boolean }[]> {
    const configName = title ? await this.getConfigName(title) : undefined;

    if (!configName) {
      return columns.map((c, i) => ({ index: i, enabled: true }));
    }

    const configs = await this.getConfigs(configName, columns);

    if (!configs[configName]) {
      return configs.default;
    }

    return configs[configName];
  }

  async getConfigName(title: string): Promise<string> {
    return localStorage.getItem(title) || "default";
  }

  async getConfigs(
    title: string,
    columns: ColumnType<T>[],
  ): Promise<Record<string, { index: number; enabled: boolean }[]>> {
    const configString = localStorage.getItem(`${title}Columns`);

    if (configString === null) {
      return { default: columns.map((c, i) => ({ index: i, enabled: true })) };
    }

    const parsed = JSON.parse(configString || "null");
    if (typeof parsed !== "object" || parsed === null) {
      return { default: columns.map((c, i) => ({ index: i, enabled: true })) };
    }

    for (const key of Object.keys(parsed)) {
      if (!Array.isArray(parsed[key])) {
        return { default: columns.map((c, i) => ({ index: i, enabled: true })) };
      }

      if (parsed[key].length !== columns.length) {
        return { default: columns.map((c, i) => ({ index: i, enabled: true })) };
      }

      for (const item of parsed[key]) {
        if (
          typeof item !== "object" ||
          item === null ||
          typeof item.index !== "number" ||
          typeof item.enabled !== "boolean"
        ) {
          return { default: columns.map((c, i) => ({ index: i, enabled: true })) };
        }
      }
    }

    return parsed;
  }

  async setConfigName(title: string, configName: string): Promise<void> {
    localStorage.setItem(title, configName);
  }

  async setConfigs(title: string, configs: Record<string, { index: number; enabled: boolean }[]>): Promise<void> {
    localStorage.setItem(`${title}Column`, JSON.stringify(configs));
  }
}
