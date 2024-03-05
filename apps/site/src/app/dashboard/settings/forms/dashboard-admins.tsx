"use client"

import { startTransition, useOptimistic } from "react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import { absoluteURL, cn, getInitials } from "@/lib/utils"

import { updateDashboardAdmins } from "../actions"

type Admin = { id: string; name: string; avatar: string }

export const DashboardAdminsForm = (props: {
  defaultValues: {
    admins: Admin[]
  }
  userId: string
  userIsOwner: boolean
}) => {
  const [optimisticAdmins, addOptimisticAdmin] = useOptimistic(
    props.defaultValues.admins,
    (
      currentState: Admin[],
      {
        action,
        optimisticValue,
      }: { action: "update" | "delete"; optimisticValue: Admin },
    ) => {
      if (action === "update") {
        return [...currentState, optimisticValue]
      } else {
        return currentState.filter((admin) => admin.id !== optimisticValue.id)
      }
    },
  )

  return (
    <>
      <ScrollArea>
        <ul className="mt-2 space-y-2.5">
          {optimisticAdmins.map(({ id, name, avatar }, index) => {
            return (
              <li
                key={id}
                className="animate-in slide-in-from-top-2 fade-in duration-700 "
                style={{
                  animationDelay: `${150 * index}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <Button
                  variant="outline"
                  aria-disabled={id === props.userId}
                  className={cn(
                    "w-full justify-start gap-2",
                    props.userIsOwner && id !== props.userId
                      ? "hover:animate-jiggle"
                      : "hover:bg-background cursor-not-allowed",
                  )}
                  onClick={async () => {
                    if (id === props.userId) return

                    if (props.userIsOwner) {
                      startTransition(() => {
                        addOptimisticAdmin({
                          action: "delete",
                          optimisticValue: { id, name, avatar },
                        })
                      })

                      await updateDashboardAdmins(
                        optimisticAdmins
                          .filter((admin) => admin.id !== id)
                          .map((admin) => admin.id),
                      )
                    }
                  }}
                >
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="text-xs">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  {name}
                </Button>
              </li>
            )
          })}
        </ul>
      </ScrollArea>
      {props.userIsOwner && (
        <div
          className="animate-in slide-in-from-top-2 fade-in flex flex-col gap-2.5 duration-1000"
          style={{
            animationDelay: `${150 * (optimisticAdmins.length + 1)}ms`,
            animationFillMode: "backwards",
          }}
        >
          <form
            className="flex gap-2.5"
            action={async (formData) => {
              const admin = formData.get("admin") as string

              if (
                admin.length < 17 ||
                admin.length > 19 ||
                ![...admin].every((char) => Number.isInteger(parseInt(char))) ||
                optimisticAdmins.find((adm) => adm.id === admin)
              ) {
                return
              }

              addOptimisticAdmin({
                action: "update",
                optimisticValue: {
                  id: admin,
                  name: "Unknown User",
                  avatar: absoluteURL("/discord.png"),
                },
              })

              await updateDashboardAdmins([
                ...optimisticAdmins.map((admin) => admin.id),
                admin,
              ])
            }}
          >
            <Input
              placeholder="Enter a user ID here"
              type="number"
              name="admin"
            />
            <Button type="submit">Add</Button>
          </form>
          <p className="text-muted-foreground text-sm">
            You are the server owner! Click on an admin to remove them.
          </p>
        </div>
      )}
    </>
  )
}
