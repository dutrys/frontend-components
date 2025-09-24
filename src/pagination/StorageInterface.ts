import { ColumnType, isActionColumn } from "@/pagination/PaginatedTable";

export interface StorageInterface<T = unknown> {
  getConfigs(
    title: string | undefined,
    columns: ColumnType<T>[],
  ): Promise<Record<string, { name: string; enabled: boolean }[]>>;
  setConfigs(title: string, configs: Record<string, { name: string; enabled: boolean }[]>): Promise<void>;
  getConfigName(title: string): Promise<string>;
  setConfigName(title: string, configName: string): Promise<void>;
  setDisplayAs(title: string, displayAs: "grid" | "list"): Promise<void>;
  getDisplayAs(title: string): Promise<"grid" | "list">;
  getConfig(title: string, columns: ColumnType<T>[]): Promise<{ name: string; enabled: boolean }[]>;
}

export class LocalStorage<T> implements StorageInterface<T> {
  async setDisplayAs(title: string, displayAs: "grid" | "list"): Promise<void> {
    localStorage.setItem(`${title}DisplayAs`, displayAs);
  }

  async getDisplayAs(title: string): Promise<"grid" | "list"> {
    return (localStorage.getItem(`${title}DisplayAs`) as "grid" | "list") || "grid";
  }

  async getConfig(title: string | undefined, columns: ColumnType<T>[]): Promise<{ name: string; enabled: boolean }[]> {
    const configName = title ? await this.getConfigName(title) : undefined;

    if (!configName) {
      return columns.map((c) => ({
        name: isActionColumn(c) ? "action" : (c.name as string),
        enabled: !c.hiddenByDefault,
      }));
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
  ): Promise<Record<string, { name: string; enabled: boolean }[]>> {
    const configString = localStorage.getItem(`${title}Columns`);

    const defaultConfig = {
      default: columns.map((c) => ({
        name: isActionColumn(c) ? "action" : (c.name as string),
        enabled: !c.hiddenByDefault,
      })),
    };
    if (configString === null) {
      return defaultConfig;
    }

    const parsed = JSON.parse(configString || "null");
    if (typeof parsed !== "object" || parsed === null) {
      return defaultConfig;
    }

    for (const key of Object.keys(parsed)) {
      if (!Array.isArray(parsed[key])) {
        return defaultConfig;
      }

      if (parsed[key].length !== columns.length) {
        return defaultConfig;
      }

      for (const item of parsed[key]) {
        if (
          typeof item !== "object" ||
          item === null ||
          typeof item.index !== "number" ||
          typeof item.enabled !== "boolean"
        ) {
          return defaultConfig;
        }
      }
    }

    return {
      ...parsed,
      default: defaultConfig.default,
    };
  }

  async setConfigName(title: string, configName: string): Promise<void> {
    localStorage.setItem(title, configName);
  }

  async setConfigs(title: string, configs: Record<string, { name: string; enabled: boolean }[]>): Promise<void> {
    localStorage.setItem(`${title}Column`, JSON.stringify(configs));
  }
}
