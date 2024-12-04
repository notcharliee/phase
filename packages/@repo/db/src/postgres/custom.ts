import { customType } from "drizzle-orm/pg-core"

export const snowflake = customType<{ data: string }>({
  dataType() {
    return "varchar(19)"
  },
})
