import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons"
import { ModuleId } from "@repo/config/phase/modules.ts"
import { capitalCase } from "change-case"
import { useFieldArray, useFormContext } from "react-hook-form"
import { v4 as randomUUID } from "uuid"

import { SelectChannel } from "~/components/dashboard/select/channel"
import { SelectRole } from "~/components/dashboard/select/role"
import { EmojiPicker } from "~/components/emoji-picker"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  FormControl,
  FormDescription,
  FormField,
  FormHeader,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { RichTextarea } from "~/components/ui/slate"

import { cn } from "~/lib/utils"

import type { modulesSchema } from "~/validators/modules"
import type { z } from "zod"

export function SelfRoles() {
  const form = useFormContext<z.infer<typeof modulesSchema>>()
  const formFields = form.watch()[ModuleId.SelfRoles]!
  const formFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.SelfRoles}.messages`,
  })

  const addMessage = (type: (typeof formFields.messages)[number]["type"]) => {
    formFieldArray.append({
      id: randomUUID(),
      type,
      name: `Message ${capitalCase(type)} ${formFields.messages.length + 1}`,
      channel: "",
      content: "",
      multiselect: false,
      methods: [],
    } satisfies (typeof formFields.messages)[number])
  }

  return (
    <div className="space-y-4">
      {formFieldArray.fields.map((field, index) => {
        const baseName = `${ModuleId.SelfRoles}.messages.${index}` as const

        const messageName =
          formFields.messages[index]?.name ?? `Message ${index + 1}`

        return (
          <FormField
            key={field.id}
            control={form.control}
            name={baseName}
            render={() => (
              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
                  <CardTitle>{messageName}</CardTitle>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => formFieldArray.remove(index)}
                  >
                    <Label className="sr-only">Delete Message</Label>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6 border-t pt-6">
                  <FormField
                    control={form.control}
                    name={`${baseName}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Example: Pick a colour role!"
                          />
                        </FormControl>
                        <FormDescription>
                          The name of the message
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${baseName}.channel`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Channel</FormLabel>
                        <FormControl>
                          <SelectChannel {...field} />
                        </FormControl>
                        <FormDescription>
                          The channel to send the message to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`${baseName}.content`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <RichTextarea
                            {...field}
                            placeholder="Example: Pick a colour role pleaseee!!"
                          />
                        </FormControl>
                        <FormDescription>
                          The content of the message
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardContent className="space-y-6 border-t pt-6">
                  <MessageMethods index={index} />
                </CardContent>
              </Card>
            )}
          />
        )
      })}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={formFieldArray.fields.length >= 10}
          >
            Add Message
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => addMessage("reaction")}>
            Reaction Based
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addMessage("button")}>
            Button Based
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addMessage("dropdown")}>
            Dropdown Based
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function MessageMethods({ index }: { index: number }) {
  const form = useFormContext<z.infer<typeof modulesSchema>>()

  const message = form.watch()[ModuleId.SelfRoles]!.messages[index]!

  const methodsFieldArray = useFieldArray({
    control: form.control,
    name: `${ModuleId.SelfRoles}.messages.${index}.methods`,
  })

  const addMethod = () => {
    if (message.type === "reaction") {
      methodsFieldArray.append({
        id: randomUUID(),
        emoji: "",
        rolesToAdd: [],
        rolesToRemove: [],
      })
    } else {
      methodsFieldArray.append({
        id: randomUUID(),
        label: "",
        rolesToAdd: [],
        rolesToRemove: [],
      })
    }
  }

  const methodName = message.type === "dropdown" ? "option" : message.type

  return (
    <div className="space-y-4">
      <FormHeader>
        <FormLabel>Methods</FormLabel>
        <FormDescription className="whitespace-pre-wrap">
          Choose the {methodName + "s"} members can use to self-assign roles.
          (max 20)
        </FormDescription>
      </FormHeader>
      <Accordion
        type="single"
        className={cn(!methodsFieldArray.fields.length && "hidden", "!my-2")}
        collapsible
      >
        {methodsFieldArray.fields.map((field, fieldIndex) => {
          const baseName =
            `${ModuleId.SelfRoles}.messages.${index}.methods.${fieldIndex}` as const

          const methodLabel = `${capitalCase(methodName)} ${fieldIndex + 1}`

          return (
            <AccordionItem value={field.id} key={field.id}>
              <AccordionTrigger className="group py-2">
                <div className="flex w-full items-center justify-between">
                  <Label className="cursor-pointer">{methodLabel}</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(event) => event.stopPropagation()}
                        asChild
                      >
                        <div>
                          <Label className="sr-only">Options</Label>
                          <DotsHorizontalIcon className="h-4 w-4" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        disabled={index === 0}
                        onClick={() => methodsFieldArray.move(index, index - 1)}
                      >
                        Move up
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={index === methodsFieldArray.fields.length - 1}
                        onClick={() => methodsFieldArray.move(index, index + 1)}
                      >
                        Move down
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => methodsFieldArray.remove(index)}
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-8 pb-6">
                {message.type === "reaction" ? (
                  <>
                    <FormField
                      control={form.control}
                      name={`${baseName}.emoji`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Emoji</FormLabel>
                          <FormControl>
                            <EmojiPicker size="fill" {...field} />
                          </FormControl>
                          <FormDescription>
                            The emoji to react with
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`${baseName}.rolesToAdd`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roles to Add</FormLabel>
                          <FormControl>
                            <SelectRole multiselect {...field} />
                          </FormControl>
                          <FormDescription>
                            The roles to assign when the button is pressed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`${baseName}.rolesToRemove`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roles to Remove</FormLabel>
                          <FormControl>
                            <SelectRole multiselect {...field} />
                          </FormControl>
                          <FormDescription>
                            The roles to remove when the button is pressed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name={`${baseName}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Example: Role 1" />
                          </FormControl>
                          <FormDescription>
                            The text to display on the button
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`${baseName}.rolesToAdd`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roles to Add</FormLabel>
                          <FormControl>
                            <SelectRole multiselect {...field} />
                          </FormControl>
                          <FormDescription>
                            The roles to assign when the button is pressed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`${baseName}.rolesToRemove`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roles to Remove</FormLabel>
                          <FormControl>
                            <SelectRole multiselect {...field} />
                          </FormControl>
                          <FormDescription>
                            The roles to remove when the button is pressed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
      <Button
        type="button"
        variant="outline"
        disabled={methodsFieldArray.fields.length >= 20}
        onClick={() => addMethod()}
      >
        Add {capitalCase(methodName)}
      </Button>
    </div>
  )
}
