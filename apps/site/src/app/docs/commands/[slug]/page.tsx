import { Metadata } from "next"
import Link from "next/link"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Clipboard } from "@/components/ui/clipboard"

import { ApplicationCommandOptionType } from "discord-api-types/v10"

import NotFound from "../../[...not-found]/page"

import commands from "@/lib/commands"
import modules from "@/lib/modules"


export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const commandIndex = commands.findIndex(command => command.name.replaceAll(" ", "-") == params.slug)
  const command = commandIndex != -1 ? commands[commandIndex]! : null

  return {
    title: command?.name ? "/" + command?.name + " - Phase Bot" : "Not Found - Phase Bot",
    description: command?.description ?? "We couldn't find what you're looking for, so have this poem instead.",
  }
}


export default (props: { params: { slug: string } }) => {
  const commandIndex = commands.findIndex(command => command.name.replaceAll(" ", "-") == props.params.slug)
  const command = commandIndex != -1 ? commands[commandIndex]! : null

  if (!command) return <NotFound />

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">/{command.name}</h1>
        <p className="text-lg text-muted-foreground">{command.description}</p>
      </div>
      <div className="pb-12 pt-8 flex flex-col gap-12">
        {command.options && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Command Options</h2>
            {command.options.map((option, index) => {
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{option.name}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-min text-sm">
                      <div className="flex justify-between">
                        <span className="mr-6 font-semibold">Type:</span>
                        <span className="text-muted-foreground">{ApplicationCommandOptionType[option.type]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="mr-6 font-semibold">Required:</span>
                        <span className="text-muted-foreground">{`${(option.required ?? false)}`.replace(/\b\w/g, match => match.toUpperCase())}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Copy Command</h2>
          <p className="leading-7">
            To use this command, click the button below to copy it, then run it in a Discord channel. Make sure the bot is in the server you want to run the command in, and that the bot has access to the channel.
          </p>
          <Clipboard content={"/" + command.name} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Link href={
          commandIndex-1 == -1
          ? modules[modules.length-1]!.docs_url
          : "/docs/commands/" + commands[commandIndex-1]!.name.replaceAll(" ", "-")
        }>
          <Button variant={"outline"}><ChevronLeftIcon className="mr-2 h-4 w-4" /> {
            commandIndex-1 == -1
              ? modules[modules.length-1]!.name
              : "/" + commands[commandIndex-1]!.name
          }</Button>
        </Link>
        <Link href={
          commandIndex+1 == commands.length
          ? "/docs/api"
          : "/docs/commands/" + commands[commandIndex+1]!.name.replaceAll(" ", "-")
        }>
          <Button variant={"outline"}>{
            commandIndex+1 == commands.length
              ? "Phase API"
              : "/" + commands[commandIndex+1]!.name
          } <ChevronRightIcon className="ml-2 h-4 w-4" /></Button>
        </Link>
      </div>
    </div>
  )
}