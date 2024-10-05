import { variables } from "@repo/utils/variables"

import { useMDXComponents } from "~/mdx-components"

interface ModuleVariableProps {
  moduleId: keyof typeof variables.modules
}

export function ModuleVariables({ moduleId }: ModuleVariableProps) {
  const MDXComponents = useMDXComponents({})

  return (
    <MDXComponents.ul>
      {variables.modules[moduleId].variables.map((variable) => {
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
