export abstract class BaseStore {
  _init = false

  /** Populates the store with data. */
  public async init() {
    if (this._init) return this

    this._init = true
    return this
  }
}
