import { Collection } from "discord.js"

export class BaseManager<K, V> {
  #collection: Collection<K, V> = new Collection()

  public get(key: K) {
    return this.#collection.get(key)
  }

  public set(key: K, value: V) {
    return this.#collection.set(key, value)
  }

  public delete(key: K) {
    return this.#collection.delete(key)
  }

  public has(key: K) {
    return this.#collection.has(key)
  }
}
