import React from "react"

import {
  CrumpledPaperIcon,
  DotsVerticalIcon,
  ResetIcon,
  TrashIcon,
} from "@radix-ui/react-icons"
import { cva } from "class-variance-authority"

import { BetaAlert } from "~/components/dashboard/modules/beta-alert"
import { ModuleTags } from "~/components/dashboard/modules/module-tags"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "~/components/ui/credenza"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

import type { IconProps } from "@radix-ui/react-icons/dist/types"
import type { ModuleDefinition, ModuleTag } from "@repo/utils/modules"
import type { ModuleData } from "~/app/dashboard/modules/page"

export type ConfigCardData = ModuleDefinition
export type ConfigCardOption = (typeof moduleOptions)[number]["value"]

export enum ConfigCardStatus {
  Clean = "clean",
  Dirty = "dirty",
  Invalid = "invalid",
  Disabled = "disabled",
}

// module card //

const moduleCardVariants = cva("relative h-full transition-colors", {
  variants: {
    variant: {
      clean: `border-border hover:border-muted-foreground`,
      dirty: `border-muted-foreground bg-muted-foreground/5 hover:border-primary border-dashed`,
      invalid: `border-destructive bg-destructive/5 hover:border-primary border-dashed`,
      disabled: `border-border cursor-not-allowed opacity-50`,
    } satisfies Record<ConfigCardStatus, string>,
  },
})

export interface ConfigCardProps {
  children: React.ReactNode
  moduleData: ModuleData
  moduleStatus: ConfigCardStatus
  onTagSelect: (tag: ModuleTag) => void
  onDropdownSelect: (option: ConfigCardOption) => void
}

export function ConfigCard({
  children,
  moduleData,
  moduleStatus,
  onTagSelect,
  onDropdownSelect,
}: ConfigCardProps) {
  return (
    <Credenza>
      <Card className={moduleCardVariants({ variant: moduleStatus })}>
        <CredenzaTrigger className="focus-visible:ring-ring absolute left-0 top-0 h-full w-full focus-visible:outline-none focus-visible:ring-1" />
        <CardHeader className="gap-1.5 space-y-0">
          <CardTitle>{moduleData.name}</CardTitle>
          <ModuleTags tags={moduleData.tags} onSelect={onTagSelect} />
          <ConfigCardOptions
            moduleStatus={moduleStatus}
            onSelect={onDropdownSelect}
          />
        </CardHeader>
        <CardContent>
          <CardDescription>{moduleData.description}</CardDescription>
        </CardContent>
      </Card>
      <CredenzaContent className="flex max-h-[90%] flex-col gap-8 overflow-auto lg:max-h-[80%]">
        <CredenzaHeader className="pb-0">
          <CredenzaTitle>{moduleData.name}</CredenzaTitle>
          <CredenzaDescription>{moduleData.description}</CredenzaDescription>
        </CredenzaHeader>
        {moduleData.tags.includes("Beta") && <BetaAlert />}
        {children}
      </CredenzaContent>
    </Credenza>
  )
}

// module options //

const moduleOptions = [
  {
    label: "Undo Changes",
    value: "undo",
    icon: ResetIcon,
    requiresDirty: true,
  },
  {
    label: "Clear Values",
    value: "reset",
    icon: CrumpledPaperIcon,
  },
  {
    label: "Remove Module",
    value: "remove",
    icon: TrashIcon,
  },
] satisfies {
  label: string
  value: string
  icon?: React.FC<IconProps>
  requiresDirty?: boolean
}[]

interface ConfigCardOptionsProps {
  moduleStatus: ConfigCardStatus
  onSelect: (item: ConfigCardOption) => void
}

function ConfigCardOptions({ moduleStatus, onSelect }: ConfigCardOptionsProps) {
  const isDirty = moduleStatus === ConfigCardStatus.Dirty

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="absolute right-6 top-6 bg-transparent"
        >
          <DotsVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {moduleOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="gap-2"
            disabled={option.requiresDirty && !isDirty}
            onSelect={() => onSelect(option.value)}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
