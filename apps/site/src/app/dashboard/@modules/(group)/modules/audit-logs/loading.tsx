import { Button } from "@/components/ui/button"

import { CardContent } from "@/components/ui/card"

import { Label } from "@/components/ui/label"

import {
  Select,
  SelectTrigger,
} from "@/components/ui/select"


export default () => (
  <CardContent className="pt-6 space-y-8">
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
      <p className="text-muted-foreground">Provides a detailed log of all server activities and events to the channel of your choice.</p>
    </div>
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Server Logs</Label>
          <Select>
            <SelectTrigger className="w-full bg-popover">
              Loading...
            </SelectTrigger>
          </Select>
          <p className="text-sm text-muted-foreground">Logs for channels, roles, boosts, and emojis</p>
        </div>
        <div className="space-y-2">
          <Label>Message Logs</Label>
          <Select>
            <SelectTrigger className="w-full bg-popover">
              Loading...
            </SelectTrigger>
          </Select>
          <p className="text-sm text-muted-foreground">Logs message deletes and edits {"[No Message Content]"}</p>
        </div>
        <div className="space-y-2">
          <Label>Voice Logs</Label>
          <Select>
            <SelectTrigger className="w-full bg-popover">
              Loading...
            </SelectTrigger>
          </Select>
          <p className="text-sm text-muted-foreground">Logs voice channel joins, leaves, mutes, and deafens</p>
        </div>
        <div className="space-y-2">
          <Label>Invite Logs</Label>
          <Select>
            <SelectTrigger className="w-full bg-popover">
              Loading...
            </SelectTrigger>
          </Select>
          <p className="text-sm text-muted-foreground">Logs invite creates and usage</p>
        </div>
        <div className="space-y-2">
          <Label>Punishment Logs</Label>
          <Select>
            <SelectTrigger className="w-full bg-popover">
              Loading...
            </SelectTrigger>
          </Select>
          <p className="text-sm text-muted-foreground">Logs bans, timeouts, and warns</p>
        </div>
      </div>
      <Button type="submit" className="mr-3">Save Changes</Button>
      <Button type="reset" variant={"destructive"}>Discard Changes</Button>
    </div>
  </CardContent>
)