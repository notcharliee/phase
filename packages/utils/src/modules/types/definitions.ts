
import { moduleTags } from "~/modules/constants/tags"
import { VariableGroup } from "~/modules/structures/VariableGroup"

import type { ModuleTag } from "~/modules/types/tags"

export interface ModuleDefinition {
  /**
   * A random ID that uniquely identifies the module.
   *
   * IDs must be 10 characters long and alphanumeric. New IDs can be generated
   * using the `genkey` script in the `@repo/database` package.
   */
  id: string
  /**
   * The module's name.
   *
   * Names must be written in title case and pluralised.
   */
  name: string
  /**
   * A short description of the module.
   *
   * Descriptions must be no more than 62 characters long and written in the
   * third-person singular present tense.
   */
  description: string
  /**
   * An array of {@link moduleTags | tags} that describe the module.
   */
  tags: ModuleTag[]
  /**
   * The variables that the module uses.
   */
  variables?: VariableGroup
}
