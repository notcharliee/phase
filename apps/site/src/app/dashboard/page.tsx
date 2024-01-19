import { cookies } from "next/headers"
import Link from "next/link"

import modules from "@/lib/modules"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"


export default () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
    {modules.map((module, index) => (
      <Card key={index} className={"flex flex-col justify-between " + (!cookies().get("guild")?.value ? "pointer-events-none opacity-50" : "")}>
        <CardHeader>
          <CardTitle>{module.name}</CardTitle>
          <CardDescription>{module.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href={"/dashboard/modules/" + module.name.replaceAll(" ","-").toLowerCase()} className="w-full">
            <Button variant={"secondary"} className="w-full">Configure</Button>
          </Link>
        </CardFooter>
      </Card>
    ))}
  </div>
)