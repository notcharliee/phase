export type Optional<T> = T | undefined

export type Arrayable<
  TValue,
  TArray extends boolean = boolean,
> = TArray extends true ? TValue[] : TValue
