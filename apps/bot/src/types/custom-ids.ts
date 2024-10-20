export type CustomID = string

export type CustomIDWithAction<TPrefix extends string> = `${TPrefix}.${string}`

export type CustomIDWithActionAndInput<TPrefix extends string> =
  `${TPrefix}.${string}.${string}`

export type ExtractCustomIDParts<T extends CustomID> =
  T extends `${infer TPrefix}.${infer TRest}`
    ? [TPrefix, ...ExtractCustomIDParts<TRest>]
    : [T]

export type ExtractCustomIDAction<T extends CustomIDWithAction<string>> =
  T extends `${string}.${infer TAction}` ? TAction : never
