export enum EntryType {
  Guild = "guild",
  User = "user",
}

export interface EntryCreateOptions {
  id: string
  type: EntryType
  reason?: string
}

export interface EntryEditOptions {
  reason?: string
}

export class Entry {
  public readonly id: EntryCreateOptions["id"]
  public readonly type: EntryCreateOptions["type"]
  public reason?: EntryCreateOptions["reason"]

  constructor(options: EntryCreateOptions) {
    this.id = options.id
    this.type = options.type
    this.reason = options.reason
  }
}
