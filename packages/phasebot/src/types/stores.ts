import type { StoreManager } from "~/structures/managers"

export type Stores = Omit<StoreManager, "client" | "init">
