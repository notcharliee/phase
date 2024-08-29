import { Badge } from "~/components/ui/badge"
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
import {
  FormControl,
  FormDescription,
  FormField,
  FormHeader,
  FormItem,
  FormLabel,
} from "~/components/ui/form"
import { Switch } from "~/components/ui/switch"

import { cn } from "~/lib/utils"

import type { ModuleId } from "@repo/config/phase/modules.ts"
import type { modulesSchema } from "~/validators/modules"
import type { Control } from "react-hook-form"
import type { z } from "zod"

interface ModuleCardProps {
  children: React.ReactNode
  id: ModuleId
  name: string
  description: string
  tags: string[]
  enabled: boolean
  control: Control<z.infer<typeof modulesSchema>>
  isDirty: boolean
  isInvalid: boolean
  isSubmitting: boolean
}

export function ModuleCard(props: ModuleCardProps) {
  return (
    <FormField
      control={props.control}
      name={props.id}
      render={() => (
        <Credenza>
          <CredenzaTrigger asChild>
            <Card
              role="button"
              tabIndex={0}
              aria-disabled={props.isSubmitting}
              className={cn(
                "focus-visible:ring-ring group relative h-full cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-1 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                props.isDirty && "border-primary bg-primary/5",
                props.isInvalid && "border-destructive bg-destructive/5",
              )}
            >
              <CardHeader className="flex flex-col space-y-1.5">
                <CardTitle>{props.name}</CardTitle>
                <div className="inline-flex gap-0.5">
                  {props.tags.map((tag) => (
                    <Badge variant={"secondary"} key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <FormField
                  control={props.control}
                  name={`${props.id}.enabled`}
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem className="absolute right-6 top-6 !m-0">
                      <FormHeader className="sr-only">
                        <FormLabel>Enabled</FormLabel>
                        <FormDescription>
                          Whether or not the module is enabled
                        </FormDescription>
                      </FormHeader>
                      <FormControl>
                        <Switch
                          {...field}
                          onClick={(event) => event.stopPropagation()}
                          defaultChecked={value}
                          checked={value}
                          onCheckedChange={onChange}
                          disabled={props.isSubmitting}
                          className="absolute right-0 top-0 !m-0"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardHeader>
              <CardContent>
                <CardDescription>{props.description}</CardDescription>
              </CardContent>
            </Card>
          </CredenzaTrigger>
          <CredenzaContent className="max-h-[90%] overflow-auto lg:max-h-[80%]">
            <FormItem className="space-y-8">
              <CredenzaHeader>
                <FormLabel asChild>
                  <CredenzaTitle>{props.name}</CredenzaTitle>
                </FormLabel>
                <FormDescription asChild>
                  <CredenzaDescription>{props.description}</CredenzaDescription>
                </FormDescription>
              </CredenzaHeader>
              <FormControl>
                <CredenzaBody>{props.children}</CredenzaBody>
              </FormControl>
            </FormItem>
          </CredenzaContent>
        </Credenza>
      )}
    />
  )
}
