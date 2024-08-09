import { BSON } from "bson"

export interface PersistentCacheOptions {
  filePath: string
}

interface InitialisedPersistentCache<T extends object = Record<string, any>>
  extends Omit<PersistentCache<T>, "init"> {
  has<TKey extends keyof T>(key: TKey): Promise<boolean>
  get<TKey extends keyof T>(key: TKey): Promise<T[TKey] | undefined>
  set<TKey extends keyof T>(key: TKey, value: T[TKey]): Promise<void>
  delete<TKey extends keyof T>(key: TKey): Promise<void>
  clear(): Promise<void>
  entries(): Promise<[keyof T, T[keyof T]][]>
  keys(): Promise<(keyof T)[]>
  values(): Promise<T[keyof T][]>
}

/**
 * A persistent cache that can be used to store data in a file.
 */
export class PersistentCache<T extends object = Record<string, any>> {
  private initisialised: boolean = false
  private filePath: string = "./cache.bson"

  constructor(options?: PersistentCacheOptions) {
    this.filePath = options?.filePath ?? "./cache.bson"
  }

  async init<TData extends T>(data?: TData) {
    if (this.initisialised) {
      throw new Error("Cache is already initialised")
    }

    await this.writeData(data)
    const thisClass = this

    this.initisialised = true

    // assign methods to the class
    Object.assign(this, {
      async has<TKey extends keyof T>(key: TKey) {
        const data = await thisClass.readData()
        return Object.hasOwn(data, key)
      },
      async get<TKey extends keyof T>(key: TKey) {
        const data = await thisClass.readData()
        return Object.hasOwn(data, key) ? data[key] : undefined
      },
      async set<TKey extends keyof T>(key: TKey, value: T[TKey]) {
        const data = await thisClass.readData()
        data[key] = value as Awaited<T>[TKey]
        thisClass.writeData(data)
      },
      async delete<TKey extends keyof T>(key: TKey) {
        const data = await thisClass.readData()
        delete data[key]
        await thisClass.writeData(data)
      },
      async clear() {
        await thisClass.writeData()
      },
      async entries() {
        const data = await thisClass.readData()
        return Object.entries(data) as [keyof T, T[keyof T]][]
      },
      async keys() {
        const data = await thisClass.readData()
        return Object.keys(data) as (keyof T)[]
      },
      async values() {
        const data = await thisClass.readData()
        return Object.values(data) as T[keyof T][]
      },
    })

    return this as unknown as InitialisedPersistentCache<TData>
  }

  private async writeData(data?: T) {
    const file = Bun.file(this.filePath)
    const bson = BSON.serialize(data ?? {})

    try {
      await Bun.write(file, bson)
    } catch (error) {
      console.error("Error writing cache to file:", error)
      throw error
    }

    return bson
  }

  private async readData() {
    const file = Bun.file(this.filePath)
    const fileExists = await file.exists()

    try {
      const bson = fileExists
        ? Buffer.from(await file.arrayBuffer())
        : await this.writeData()

      const data = BSON.deserialize(bson) as T

      return data
    } catch (error) {
      console.error("Error reading cache from file:", error)
      throw error
    }
  }
}
