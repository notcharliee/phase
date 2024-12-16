export type BuilderOrBuilderFunction<TBuilder, TReturn = TBuilder> =
  | TReturn
  | ((builder: TBuilder) => TReturn)
