import { moduleVariables } from "@repo/config/phase/variables.ts"

import { useMDXComponents } from "~/mdx-components"

interface ModuleVariableProps {
  moduleId: keyof typeof moduleVariables
}

export function ModuleVariables({ moduleId }: ModuleVariableProps) {
  const MDXComponents = useMDXComponents({})

  return (
    <MDXComponents.ul>
      {moduleVariables[moduleId].map((variable) => {
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
