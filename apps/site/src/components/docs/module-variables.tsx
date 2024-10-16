import { ModuleDefinitions } from "@repo/utils/modules"

import { useMDXComponents } from "~/mdx-components"

import type { ModuleId } from "@repo/utils/modules"

interface ModuleVariableProps {
  moduleId: ModuleId
}

export function ModuleVariables({ moduleId }: ModuleVariableProps) {
  const MDXComponents = useMDXComponents({})

  const definition = ModuleDefinitions[moduleId]
  const variables = "variables" in definition ? definition.variables : undefined

  if (!variables) return null

  return (
    <MDXComponents.ul>
      {variables.variables.map((variable) => {
        return (
          <MDXComponents.li key={variable.name}>
            <MDXComponents.code>{`{${variable.name}}`}</MDXComponents.code> -{" "}
            {variable.description}
          </MDXComponents.li>
        )
      })}
    </MDXComponents.ul>
  )
}
