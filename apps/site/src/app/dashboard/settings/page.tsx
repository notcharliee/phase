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
import { SelectServerCombobox } from "../components/select/server"
import { Suspense } from "react"

export default function SettingsPage() {
  return (
    <div className="m-8 flex flex-col space-y-12 md:m-12 md:mx-16 xl:mx-24">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <Dialog>
          <DialogTrigger>
            <Button className="hidden md:block">Change Server</Button>
            <Button className="md:hidden">Change Server</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a server</DialogTitle>
              <DialogDescription>
                Please select a server to continue. You can change this at any
                time. If you don't see your server, make sure the bot is in it.
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
        <aside className="md:min-w-xs w-full md:h-[calc(100vh-4rem-6rem-3rem-36px-1px)] md:max-w-xs">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Dashboard Admins</CardTitle>
              <CardDescription>
                Manage your server's dashboard admins
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full pb-6">
              <p>Content</p>
            </CardContent>
          </Card>
        </aside>
        <div className="flex flex-col gap-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Bot Nickname</CardTitle>
              <CardDescription>
                Change the nickname of the bot in your server. This will not
                affect the bot's username. This is useful for servers with a lot
                of bots.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full pb-6">
              <p>Content</p>
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
              <p>Content</p>
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
              <div className="flex gap-3">
                <Button className={buttonVariants({ variant: "destructive" })}>
                  Reset Bot
                </Button>
                <Button className={buttonVariants({ variant: "destructive" })}>
                  Remove Bot
                </Button>
                <Button className={buttonVariants({ variant: "destructive" })}>
                  Delete Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
