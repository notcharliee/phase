import type { StoreManager } from "~/managers/StoreManager"

export type Stores = Omit<StoreManager, "client" | "init">
