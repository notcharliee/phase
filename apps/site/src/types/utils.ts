export type Optional<T> = T | undefined
export type Arrayable<
  TValue,
  TArray extends boolean = boolean,
> = TArray extends true ? TValue[] : TValue

export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

export type PascalToKebab<
  T extends string,
  Accumulator extends string = "",
> = T extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? PascalToKebab<
        Rest,
        `${Accumulator}${Accumulator extends "" ? "" : "-"}${Lowercase<First>}`
      >
    : PascalToKebab<Rest, `${Accumulator}${First}`>
  : Accumulator
