import { promises as fs } from "fs"

import { cookies } from "next/headers"
import { type Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"


export default async () => {
  const moduleDirs = await fs.readdir(process.cwd() + "/src/app/dashboard/modules")

  const moduleData = await Promise.all(moduleDirs.map(async (moduleDir) => {
    const moduleMetadata = (await import(`./modules/${moduleDir}/page`)).metadata as Metadata

    return {
      name: moduleMetadata.title?.toString().replace(" - Phase Bot", ""),
      description: moduleMetadata.description,
      url: `/dashboard/modules/${moduleDir}`,
    }
  }))
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {moduleData.map((module, index) => (
        <Card key={index} className={"flex flex-col justify-between " + (!cookies().get("guild")?.value ? "pointer-events-none opacity-50" : "")}>
          <CardHeader>
            <CardTitle>{module.name}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href={module.url} className="w-full">
              <Button variant={"secondary"} className="w-full">Configure</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
