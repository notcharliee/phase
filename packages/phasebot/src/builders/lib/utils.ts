import type { JSONEncodable } from "discord.js"

export function resolveBuilder<
  Builder extends JSONEncodable<any>,
  BuilderData extends Record<PropertyKey, any>,
>(
  builder: Builder | BuilderData | ((builder: Builder) => Builder),
  Constructor: new (data?: BuilderData) => Builder,
): Builder {
  const isBuilder = <Builder extends JSONEncodable<any>>(
    builder: unknown,
    Constructor: new () => Builder,
  ): builder is Builder => {
    return builder instanceof Constructor
  }

  if (isBuilder(builder, Constructor)) return builder
  if (typeof builder === "function") return builder(new Constructor())

  return new Constructor(builder)
}
