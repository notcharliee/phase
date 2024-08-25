"use client"

// import { PlusIcon } from "@radix-ui/react-icons"
import { ModuleId, modules, moduleTags } from "@repo/config/phase/modules.ts"
import { useLocalStorage } from "@uidotdev/usehooks"
import { toast } from "sonner"

import { Badge } from "~/components/ui/badge"
// import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "~/components/ui/credenza"
// import { Link } from "~/components/ui/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"

// import { useMediaQuery } from "~/hooks/use-media-query"
import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { GuildModules } from "~/lib/db"

import { updateModule } from "../_actions/updateModule"
import { moduleForms } from "./forms"

const filterOptions = [
  { label: "None", value: "none" },
  { label: "Engagement", value: "engagement" },
  { label: "Moderation", value: "moderation" },
  { label: "Utility", value: "utility" },
  { label: "Notifications", value: "notifications" },
  { label: "New", value: "new" },
  { label: "Beta", value: "beta" },
] as const satisfies {
  label: (typeof moduleTags)[number] | "None"
  value: Lowercase<(typeof moduleTags)[number]> | "none"
}[]

export default function Page() {
  const dashboardData = useDashboardContext()

  const [filter, setFilter] = useLocalStorage<
    (typeof filterOptions)[number]["value"]
  >("modulesFilter", "none")

  const guildModules = dashboardData.guild.modules ?? {}

  const guildModulesData = Object.entries(modules)
    .map(([moduleId, moduleInfo]) => ({
      ...moduleInfo,
      id: moduleId as ModuleId,
      enabled: guildModules[moduleId as ModuleId]?.enabled ?? false,
    }))
    .filter((moduleInfo) => {
      if (filter === "none") return true
      return moduleInfo.tags.some((tag) => tag.toLowerCase() === filter)
    })

  return (
    <div className="space-y-8 [--column-count:1] lg:[--column-count:2] xl:[--column-count:3]">
      <div className="grid w-full grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
        <h1 className="hidden text-3xl font-bold lg:block xl:col-span-2">
          Modules
        </h1>
        <div className="flex items-center space-x-2">
          <SelectFilter value={filter} onChange={setFilter} />
          {/* <AddModule variant="button" /> */}
        </div>
      </div>
      <div className="grid grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
        {guildModulesData.map((moduleData) => {
          const moduleKey = Object.keys(ModuleId)[
            Object.values(ModuleId).indexOf(moduleData.id)
          ] as keyof typeof moduleForms

          const ModuleForm = moduleForms[moduleKey]
          if (!ModuleForm) return null

          return (
            <ModuleCard
              key={moduleData.name}
              id={moduleData.id}
              name={moduleData.name}
              description={moduleData.description}
              tags={moduleData.tags}
              enabled={moduleData.enabled}
            >
              <ModuleForm />
            </ModuleCard>
          )
        })}
        {/* <AddModule variant="card" /> */}
      </div>
    </div>
  )
}

interface SelectFilterProps {
  value: (typeof filterOptions)[number]["value"]
  onChange: (value: (typeof filterOptions)[number]["value"]) => void
}

export function SelectFilter(props: SelectFilterProps) {
  return (
    <Select defaultValue={props.value} onValueChange={props.onChange}>
      <SelectTrigger>
        <div className="inline-flex space-x-2 font-medium">
          <span className="text-muted-foreground">Filters:</span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {filterOptions.map(({ label, value }) => (
          <SelectItem value={value} key={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// interface AddModuleProps {
//   variant: "button" | "card"
// }

// function AddModule(props: AddModuleProps) {
//   const dashboardData = useDashboardContext()
//   const isMobile = useMediaQuery("(max-width: 1024px)")

//   const guildModules = dashboardData.guild.modules ?? {}
//   const guildModuleIds = Object.keys(guildModules) as ModuleId[]

//   const guildModulesInfo = (Object.keys(modules) as ModuleId[])
//     .filter((key) => !guildModuleIds.includes(key))
//     .map((moduleId) => ({
//       ...modules[moduleId],
//       id: moduleId,
//       enabled: false,
//     }))

//   return (
//     <Credenza>
//       <CredenzaTrigger asChild>
//         {props.variant === "button" ? (
//           isMobile ? (
//             <Button size={"icon"} className="lg:hidden">
//               <PlusIcon className="size-5" />
//             </Button>
//           ) : (
//             <Button className="hidden space-x-2 lg:inline-flex">
//               <PlusIcon className="size-4" />
//               <span>Add Module</span>
//             </Button>
//           )
//         ) : (
//           <Button
//             variant={"outline"}
//             className="text-muted-foreground hidden h-full space-x-2 rounded-xl border-dashed text-base font-normal lg:flex"
//           >
//             <PlusIcon className="size-5" />
//             <span>Add Module</span>
//           </Button>
//         )}
//       </CredenzaTrigger>
//       <CredenzaContent>
//         <CredenzaHeader>
//           <CredenzaTitle>Add Module</CredenzaTitle>
//           <CredenzaDescription>
//             For information about modules, you can either read our{" "}
//             <Link href="/docs">docs</Link> or ask us directly in our{" "}
//             <Link href="/redirect/discord">discord server.</Link>
//           </CredenzaDescription>
//         </CredenzaHeader>
//         <CredenzaBody>
//           <Select>
//             <SelectTrigger>
//               <div className="inline-flex space-x-2 font-medium">
//                 <span className="text-muted-foreground">Select a module:</span>
//                 <SelectValue />
//               </div>
//             </SelectTrigger>
//             <SelectContent>
//               {guildModulesInfo.map(({ name, id }) => (
//                 <SelectItem value={id} key={id}>
//                   {name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CredenzaBody>
//       </CredenzaContent>
//     </Credenza>
//   )
// }

interface ModuleCardProps {
  id: ModuleId
  name: string
  description: string
  tags: string[]
  enabled: boolean
  children: React.ReactNode
}

function ModuleCard(props: ModuleCardProps) {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Card
          tabIndex={0}
          className="focus-visible:ring-ring h-full cursor-pointer text-start transition-all focus-visible:outline-none focus-visible:ring-1"
        >
          <CardHeader className="flex-row justify-between space-y-0">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>{props.name}</CardTitle>
              <div className="inline-flex gap-0.5">
                {props.tags.map((tag) => (
                  <Badge variant={"secondary"} key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <ModuleSwitch defaultChecked={props.enabled} moduleId={props.id} />
          </CardHeader>
          <CardContent>
            <CardDescription>{props.description}</CardDescription>
          </CardContent>
        </Card>
      </CredenzaTrigger>
      <CredenzaContent className="max-h-[90%] overflow-auto lg:max-h-[80%]">
        <CredenzaHeader>
          <CredenzaTitle>{props.name}</CredenzaTitle>
          <CredenzaDescription>{props.description}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>{props.children}</CredenzaBody>
      </CredenzaContent>
    </Credenza>
  )
}

interface ModuleSwitchProps<T extends ModuleId> {
  defaultChecked: boolean
  moduleId: T
}

function ModuleSwitch<T extends ModuleId>(props: ModuleSwitchProps<T>) {
  const dashboardData = useDashboardContext()

  const onCheckedChange = async (checked: boolean) => {
    try {
      const currentModuleData = dashboardData.guild.modules![
        props.moduleId
      ]! as GuildModules[T]

      const updatedModuleData = await updateModule(props.moduleId, {
        ...currentModuleData,
        enabled: checked,
      })

      dashboardData.setData((dashboardData) => {
        if (!dashboardData.guild.modules) dashboardData.guild.modules = {}
        dashboardData.guild.modules[props.moduleId] = updatedModuleData
        return dashboardData
      })
    } catch {
      const enabledStatus = checked ? "enabled" : "disabled"
      toast.error(`Failed to ${enabledStatus} module`)
    }
  }

  return (
    <Switch
      defaultChecked={props.defaultChecked}
      onClick={(event) => event.stopPropagation()}
      onCheckedChange={onCheckedChange}
    />
  )
}
