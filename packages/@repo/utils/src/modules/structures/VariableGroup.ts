import type { Variable } from "~/modules/structures/Variable"

export class VariableGroup<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends [any, ...any[]] = [any, ...any[]],
> {
  readonly variables: Variable<TArgs>[]
  readonly parse: (value: string, ...args: TArgs) => string

  constructor(variables: Variable<TArgs>[]) {
    this.variables = variables
    this.parse = (value: string, ...args: TArgs) => {
      return variables.reduce((acc, variable) => {
        return variable.parse(acc, ...args)
      }, value)
    }
  }
}
