import type { StoreManager } from "~/managers/StoreManager"
import type { BaseKVStore, BaseStore } from "~/stores"

export type BotStore = BaseStore | BaseKVStore

type BotStoreKeys = Exclude<keyof StoreManager, "phase" | "init">

export type BotStores = Record<
  BotStoreKeys extends never ? string : BotStoreKeys,
  BotStore
>
