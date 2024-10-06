export class Variable<TArgs extends [any, ...any[]] = [any]> {
  readonly name: string
  readonly description: string
  readonly syntax: RegExp
  readonly parse: (value: string, ...args: TArgs) => string

  constructor(data: {
    name: string
    description: string
    syntax: RegExp
    parse: (value: string, ...args: TArgs) => string
  }) {
    this.name = data.name
    this.description = data.description
    this.syntax = data.syntax
    this.parse = data.parse
  }
}

export class VariableGroup<TArgs extends [any, ...any[]] = [any]> {
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
