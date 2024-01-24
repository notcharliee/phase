"use client"

import { useRouter } from "next/navigation"

import { z } from "zod"

import type { APIRole } from "discord-api-types/v10"

import { updateModule } from "@/lib/actions"

import { Button } from "@/components/ui/button"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  formBuilder,
} from "@/components/ui/form"

import { Label } from "@/components/ui/label"

import {
  RoleSelect,
  SelectFallback,
} from "@/components/dashboard/modules/select"


const formSchema = z.object({
  enabled: z.boolean(),
  roles: z.string().optional().nullable().array()
})


export const ModuleForm = (props: {
  defaultValues: z.TypeOf<typeof formSchema>,
  data: {
    roles: APIRole[],
  },
}) => {
  const roles = props.data.roles
  const router = useRouter()

  return formBuilder({
    defaultValues: props.defaultValues,
    onSubmit: (data) => updateModule("AutoRoles", {
      enabled: data.enabled,
      roles: data.roles.filter(Boolean) as string[],
    }),
    schema: formSchema,
  },
  ({ form }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="roles.0"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Role</FormLabel>
              <FormControl>
                <RoleSelect roles={roles} field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles.1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Second Role</FormLabel>
              <FormControl>
                <RoleSelect roles={roles} field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles.2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Third Role</FormLabel>
              <FormControl>
                <RoleSelect roles={roles} field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button type="submit" className="mr-3">Save Changes</Button>
      <Button type="reset" variant="secondary" onClick={() => router.back()}>Go Back</Button>
    </div>
  ))
}


export const ModuleFormFallback = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label>First Role</Label>
        <SelectFallback />
      </div>
      <div className="space-y-2">
        <Label>Second Role</Label>
        <SelectFallback />
      </div>
      <div className="space-y-2">
        <Label>Third Role</Label>
        <SelectFallback />
      </div>
    </div>
    <Button type="submit" className="mr-3">Save Changes</Button>
    <Button type="reset" variant="secondary">Go Back</Button>
  </div>
)