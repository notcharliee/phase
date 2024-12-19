export type Optional<T> = T | undefined

export type Arrayable<
  TValue,
  TArray extends boolean = boolean,
> = TArray extends true ? TValue[] : TValue

export type WithRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
