import { Metadata } from "next"
import Link from "next/link"

import { env } from "@/env"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"

import NotFound from "../../[...not-found]/page"

import modules from "@/lib/modules"


export function generateMetadata(props: { params: { slug: string } }): Metadata {
  const moduleIndex = modules.findIndex(module => module.docs_url == `${env.NEXT_PUBLIC_BASE_URL}/docs/modules/${props.params.slug}`)
  const module = moduleIndex != -1 ? modules[moduleIndex]! : null

  return {
    title: module?.name ? module?.name + " - Phase Bot" : "Not Found - Phase Bot",
    description: module?.description ?? "We couldn't find what you're looking for, so have this poem instead.",
  }
}


export default (props: { params: { slug: string } }) => {
  const moduleIndex = modules.findIndex(module => module.docs_url == `${env.NEXT_PUBLIC_BASE_URL}/docs/modules/${props.params.slug}`)
  const module = moduleIndex != -1 ? modules[moduleIndex]! : null

  if (!module) return <NotFound />

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{module.name}</h1>
        <p className="text-lg text-muted-foreground">{module.description}</p>
      </div>
      <div className="pb-12 pt-8" children={module.docs_jsx} />
      <div className="flex items-center justify-between">
        <Link href={
          moduleIndex-1 == -1
          ? "/docs"
          : modules[moduleIndex-1]!.docs_url
        }>
          <Button variant={"outline"}><ChevronLeftIcon className="mr-2 h-4 w-4" /> {
            moduleIndex-1 == -1
              ? "Introduction"
              : modules[moduleIndex-1]!.name
          }</Button>
        </Link>
        <Link href={
          moduleIndex+1 == modules.length
          ? "/docs/commands"
          : modules[moduleIndex+1]!.docs_url
        }>
          <Button variant={"outline"}>{
            moduleIndex+1 == modules.length
              ? "Commands"
              : modules[moduleIndex+1]!.name
          } <ChevronRightIcon className="ml-2 h-4 w-4" /></Button>
        </Link>
      </div>
    </div>
  )
}