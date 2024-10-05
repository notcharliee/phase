export type BuilderOrBuilderFunction<T> = T | ((builder: T) => T)
