import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default () => (
  <Card className="h-full">
    <CardContent className="pt-6 flex flex-col">
      <Tabs defaultValue="account" className="flex flex-col gap-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guild">Server</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="guild" className="mt-0">
          server settings woahhh
        </TabsContent>
        <TabsContent value="account" className="mt-0">
          account settings woahhh
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
)