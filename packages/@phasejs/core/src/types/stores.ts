import type { BaseKVStore, BaseStore } from "~/stores"

export type Stores = Record<string, BaseStore | BaseKVStore>
