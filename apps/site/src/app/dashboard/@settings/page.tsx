import { cookies, headers } from "next/headers"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

import { env } from "@/lib/env"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Button,
} from "@/components/ui/button"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  Clipboard,
} from "@/components/ui/clipboard"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Label,
} from "@/components/ui/label"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  deleteAccount,
} from "./actions"

import {
  BotNicknameForm,
} from "./forms"

import { ServerAction } from "@/components/server-action"


const discordREST = new REST().setToken(env.DISCORD_TOKEN)
const discordAPI = new API(discordREST)


export default () => (
  <Card className="h-full md:overflow-auto">
    <CardContent className="pt-6 flex flex-col">
      <Tabs defaultValue="account" className="flex flex-col gap-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="server">Server</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-0 space-y-8">
          <Account />
        </TabsContent>
        <TabsContent value="server" className="mt-0 space-y-8">
          <Server />
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
)


const Account = () => (<>
  <div>
    <Label>Account Settings</Label>
    <p className="text-muted-foreground">
      Manage the currently logged in Discord account.
    </p>
  </div>
  <div>
    <Label>Your Details</Label>
    <p className="text-muted-foreground">See your current authentication details.</p>
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Keep these secret!</DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-6">
          <div className="grid flex-1 gap-2">
            <Label>User ID</Label>
            <Clipboard>{headers().get("x-user-id")!}</Clipboard>
          </div>
          <div className="grid flex-1 gap-2">
            <Label>Authentication Token</Label>
            <Clipboard secret>{headers().get("x-user-session")!}</Clipboard>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
  <div>
    <Label>Delete Account</Label>
    <p className="text-muted-foreground">Delete your Discord OAuth2 data from the database. <strong>This cannot be undone.</strong></p>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className="mt-3">Delete Data</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <ServerAction action={deleteAccount}>
            <AlertDialogAction>Continue</AlertDialogAction>
          </ServerAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</>)


const Server = async () => {
  const guildId = cookies().get("guild")?.value
  const botId = env.DISCORD_ID

  const defaultNickname = guildId ? (await discordAPI.guilds.getMember(guildId, botId)).nick : undefined

  return (<>
    <div>
      <Label>Server Settings</Label>
      <p className="text-muted-foreground">
        Manage the currently selected server's basic bot settings.
      </p>
    </div>
    <BotNicknameForm default={defaultNickname ?? undefined} />
  </>)
}