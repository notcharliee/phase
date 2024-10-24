export type Optional<T> = T | undefined

export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>