export type CapitalizeWords<T extends string> =
  T extends `${infer FirstWord} ${infer Rest}`
    ? `${Capitalize<FirstWord>}${CapitalizeWords<Rest>}`
    : Capitalize<T>

export type RemoveSpaces<T extends string> = T extends `${infer A} ${infer B}`
  ? RemoveSpaces<`${A}${B}`>
  : T

export type FormatName<T extends string> = RemoveSpaces<CapitalizeWords<T>>
