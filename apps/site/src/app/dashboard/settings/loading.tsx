import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SelectChannel } from "../components/select/channel"
import { SelectServerCombobox } from "../components/select/server"
import { Spinner } from "@/components/spinner"
import { Suspense } from "react"

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Change Server</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a server</DialogTitle>
              <DialogDescription>
                Please select a server to continue. You can change this at any
                time. If you don&rsquo;t see your server, make sure the bot is
                in it.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Suspense fallback={<SelectServerCombobox fallback />}>
                <SelectServerCombobox />
              </Suspense>
              <DialogClose className={buttonVariants()}>Close</DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden md:flex-row">
        <aside className="md:min-w-xs w-full md:h-[calc(100vh-4rem-1px-1.5rem-36px-1.5rem-2rem)] md:max-w-xs">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Dashboard Admins</CardTitle>
              <CardDescription>
                These are the users who have access to the dashboard and can
                manage the bot.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <Spinner className="mx-auto h-8 w-8" />
            </CardContent>
          </Card>
        </aside>
        <div className="flex flex-col gap-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Bot Nickname</CardTitle>
              <CardDescription>
                Change the nickname of the bot in your server. This will not
                affect the bot&rsquo;s username. This is useful for servers with
                a lot of bots.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full pb-6">
              <div className="flex gap-4">
                <Input placeholder="Enter a nickname here" />
                <Button>Save</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>News Channel</CardTitle>
              <CardDescription>
                Set a news channel for your server. This is how you can stay up
                to date about new commands, modules, possible outages, and more.
                Unlike the Phase discord server, you will not be pinged from
                this.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full pb-6">
              <div className="flex gap-4">
                <SelectChannel fallback />
                <Button>Save</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                All of these actions have permanent effects. Please be careful.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <div className="grid gap-3 sm:flex">
                <Button variant="destructive">Reset Bot</Button>
                <Button variant="destructive">Remove Bot</Button>
                <Button variant="destructive">Delete Data</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
