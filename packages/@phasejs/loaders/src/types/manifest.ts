export interface AppManifest {
  middleware: string | undefined
  prestart: string | undefined
  commands: string[]
  crons: string[]
  events: string[]
}
