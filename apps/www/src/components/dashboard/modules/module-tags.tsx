import { badgeVariants } from "@repo/ui/badge"

import { cn } from "~/lib/utils"

import type { ModuleTag } from "@repo/utils/modules"

export interface ModuleTagsProps {
  tags: ModuleTag[]
  onSelect?: (tag: ModuleTag) => void
}

export function ModuleTags({ tags, onSelect }: ModuleTagsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect?.(tag.toLowerCase() as ModuleTag)}
          className={cn(
            badgeVariants({ variant: "secondary" }),
            "hover:bg-secondary/80 relative",
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
