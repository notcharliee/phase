import {
  ArrowTopRightIcon,
  CaretSortIcon,
  ChatBubbleIcon,
  CheckCircledIcon,
  LightningBoltIcon,
  OpenInNewWindowIcon,
  PersonIcon,
} from "@radix-ui/react-icons"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { CircleProgressBar } from "@/components/circle-progress-bar"
import {
  Select,
  SelectTrigger,
} from "@/components/ui/select"

import { dashboardConfig } from "@/config/dashboard"
import { cn } from "@/lib/utils"


export default () => (
  <main className="w-full min-h-screen flex flex-col">
    <header className="border-b z-50 sticky top-0 backdrop-blur-sm">
      <div className="flex h-16 items-center px-8">
        <Button
          variant="outline"
          className="w-full sm:w-[200px] justify-between"
        >
          <div className="flex gap-2 items-center line-clamp-1">
            <Avatar className="w-5 h-5">
              <AvatarImage src={"https://i.pinimg.com/736x/fd/4b/9a/fd4b9abd9a04bf2272c0282c761f92f5.jpg"} />
              <AvatarFallback className="text-xs">SC</AvatarFallback>
            </Avatar>
            super cool gc
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          {dashboardConfig.mainNav.map((item) => (
            <span
              key={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative cursor-pointer",
                "/dashboard" !== item.href && "text-muted-foreground",
              )}
            >
              {item.title}
              {item.external && <ArrowTopRightIcon shapeRendering="geometricPrecision" className="h-[9px] w-[9px] absolute top-0.5 -right-[12px]" />}
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="outline"
            className={"relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"}
          >
            <span className="hidden lg:inline-flex">Search dashboard...</span>
            <span className="inline-flex lg:hidden">Search...</span>
            <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={"https://github.com/notcharliee.png"} alt={"notcharliee"} />
              <AvatarFallback>CH</AvatarFallback>
            </Avatar>
          </Button>
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
                <DemoLeaderboard />
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
                <DemoCommand name="/cat" description="Finds a random picture of a cat." />
                <DemoCommand name="/catfact" description="Finds an interesting fact about cats." />
                <DemoCommand name="/coinflip" description="Flips a coin." />
                <DemoCommand name="/compliment" description="Generates a personal compliment for you!" />
                <DemoCommand name="/dadjoke" description="Finds a dad joke." />
                <DemoCommand name="/dog" description="Finds a random picture of a dog." />
                <DemoCommand name="/duck" description="Finds a random picture of a duck.." />
                <DemoCommand name="/rps" description="Play a game of rock-paper-scissors." />
                <DemoCommand name="/tictactoe" description="Play tic-tac-toe against another user." />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </main>
)


const DemoCommand = (props: { name: string, description: string }) => (
  <Card className="flex flex-col justify-between">
    <CardHeader>
      <CardTitle>{props.name}</CardTitle>
      <CardDescription>{props.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Select>
        <SelectTrigger className="bg-popover">
          Select a role
        </SelectTrigger>
      </Select>
    </CardContent>
  </Card>
)

const DemoLeaderboard = () => (
  <>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Gizmo&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Gizmo" />
        <AvatarFallback>{"GI"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">1st Place</div>
        <div className="text-muted-background">Gizmo</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(7420 / (46 * 500)) * 100} text={"46"} className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Cuddles&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Cuddles" />
        <AvatarFallback>{"CU"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">2nd Place</div>
        <div className="text-muted-background">Cuddles</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(3420 / (42 * 500)) * 100} text={"42"} className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Snowball&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Snowball" />
        <AvatarFallback>{"SN"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">3rd Place</div>
        <div className="text-muted-background">Snowball</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(15420 / (39 * 500)) * 100} text={"39"} className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Sugar&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Sugar" />
        <AvatarFallback>{"SU"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">4th Place</div>
        <div className="text-muted-background">Sugar</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(9420 / (38 * 500)) * 100} text={"38"} className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Leo&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Leo" />
        <AvatarFallback>{"LE"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">5th Place</div>
        <div className="text-muted-background">Leo</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(7420 / (36 * 500)) * 100} text={"36"} className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Jasmine&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Jasmine" />
        <AvatarFallback>{"JA"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">6th Place</div>
        <div className="text-muted-background">Jasmine</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(13420 / (32 * 500)) * 100} text={"32"} className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Sheba&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Sheba" />
        <AvatarFallback>{"SH"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">7th Place</div>
        <div className="text-muted-background">Sheba</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(7420 / (29 * 500)) * 100} text={"29"} className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Bailey&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Bailey" />
        <AvatarFallback>{"BA"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">8th Place</div>
        <div className="text-muted-background">Bailey</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(3420 / (25 * 500)) * 100} text={"25"} className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Tiger&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Tiger" />
        <AvatarFallback>{"TI"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">9th Place</div>
        <div className="text-muted-background">Tiger</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(9500 / (24 * 500)) * 100} text={"24"} className="ml-auto mr-0" />
    </div>
    <div className="flex gap-4 h-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://api.dicebear.com/7.x/lorelei/svg?seed=Angel&radius=50&backgroundColor=ffd5dc,ffdfbf,d1d4f9,c0aede,b6e3f4" alt="Angel" />
        <AvatarFallback>{"AN"}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">10th Place</div>
        <div className="text-muted-background">Angel</div>
      </div>
      <CircleProgressBar width={48} height={48} value={(3420 / (22 * 500)) * 100} text={"22"} className="ml-auto mr-0" />
    </div>
  </>
)
