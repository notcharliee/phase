import type { BaseKVStore, BaseStore } from "~/stores"

export type BotStore = BaseStore | BaseKVStore

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface BotStores {
  [key: string]: BotStore
}
