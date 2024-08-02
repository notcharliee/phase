export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S

export type PascalToSentence<S extends string> =
  S extends `${infer T}${infer U}`
    ? `${Lowercase<T>}${U extends Capitalize<U> ? ` ${Lowercase<U>}` : PascalToSentence<U>}`
    : S

export type TrimTrailingSpaces<S extends string> = S extends `${infer R} `
  ? TrimTrailingSpaces<R>
  : S

export type ChannelTypeName<S extends string> = TrimTrailingSpaces<
  S extends `${infer Prefix}Guild${infer Suffix}`
    ? PascalToSentence<`${Prefix}${Suffix}`>
    : PascalToSentence<S>
>
