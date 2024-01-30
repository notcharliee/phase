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


export const SelectServerDialog = (props: { combobox: JSX.Element }) => {
  const mounted = useMounted()

  return (
    <AlertDialog defaultOpen={false} open={mounted}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to the dashboard!</AlertDialogTitle>
          <AlertDialogDescription>
            You need to select a server to get started. If you don't have the bot in any of your servers yet, you can add it by clicking the button below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4 flex-col sm:flex-row">
          {props.combobox}
          <Link className={buttonVariants({ variant: "default" })} href={"/redirect/invite"}>
            Add a server
          </Link>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}