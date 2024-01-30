import {
  ChatBubbleIcon,
  CheckCircledIcon,
  LightningBoltIcon,
  OpenInNewWindowIcon,
  PersonIcon,
} from "@radix-ui/react-icons"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { MainNav } from "@/app/dashboard/components/main-nav"
import { UserNav } from "@/app/dashboard/components/user-nav"
import { SearchDashboard } from "@/app/dashboard/components/search-dashboard"
import { SelectServerCombobox } from "@/app/dashboard/components/select-server"
import { Commands } from "@/app/dashboard/components/commands"
import { LevelsLeaderboard } from "@/app/dashboard/components/levels-leaderboard"

import { dashboardConfig } from "@/config/dashboard"


export const DashboardDemo = () => (
  <main className="w-full min-h-screen flex flex-col">
    <header className="border-b z-50 sticky top-0 backdrop-blur-sm">
      <div className="flex h-16 items-center px-8">
        <SelectServerCombobox fallback />
        <MainNav items={dashboardConfig.mainNav} className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <SearchDashboard />
          <UserNav fallback />
        </div>
      </div>
    </header>
    <div className="flex flex-col overflow-auto md:h-[calc(100vh-65px)] md:overflow-hidden space-y-4 p-8 py-6 sticky top-[5.5rem]">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <PersonIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">69,000</span>
            <p className="text-xs text-muted-foreground">
              Last updated: 1m ago
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <ChatBubbleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">4,200</span>
            <p className="text-xs text-muted-foreground">
              Last updated: 1m ago
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enabled Modules</CardTitle>
            <LightningBoltIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">5/7</span>
            <div className="flex items-center hover:underline underline-offset-2 hover:animate-pulse">
              <p className="text-xs text-muted-foreground">Module settings</p>
              <OpenInNewWindowIcon className="h-3 w-3 ml-1 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
            <CheckCircledIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">No Issues</span>
            <div className="flex items-center hover:underline underline-offset-2 hover:animate-pulse">
              <p className="text-xs text-muted-foreground">Join our Discord for alerts</p>
              <OpenInNewWindowIcon className="h-3 w-3 ml-1 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="h-full flex flex-col md:flex-row gap-4 overflow-hidden">
        <div className="h-full md:min-w-[50%] lg:min-w-[35%] rounded-xl overflow-hidden">
          <Card className="h-full overflow-hidden">
            <CardHeader>
              <CardTitle>Top Members</CardTitle>
              <CardDescription>These are the most active members in your server.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-full flex flex-col gap-3">
                <LevelsLeaderboard fallback />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="h-full md:w-full rounded-xl overflow-hidden">
          <Card className="h-full overflow-hidden">
            <CardHeader>
              <CardTitle>Command Config</CardTitle>
              <CardDescription>Set required roles for each slash command.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-full grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                <Commands fallback />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </main>
)

export default DashboardDemo
