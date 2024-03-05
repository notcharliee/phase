"use client"

import Link from "next/link"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"

import { useMounted } from "@/hooks/use-mounted"

export const SelectServerDialog = (props: { children: JSX.Element }) => {
  const mounted = useMounted()

  return (
    <AlertDialog defaultOpen={false} open={mounted}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to the dashboard!</AlertDialogTitle>
          <AlertDialogDescription>
            You need to select a server to get started. If you don&rsquo;t have
            the bot in any of your servers yet, you can add it by clicking the
            button below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4 sm:flex-row">
          {props.children}
          <Link
            className={buttonVariants({ variant: "default" })}
            href={"/redirect/invite"}
          >
            Add a server
          </Link>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
