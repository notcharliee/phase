import { Metadata } from "next"
import Link from "next/link"


export const metadata: Metadata = {
  title: "Privacy Policy - Phase Bot",
  description: "This document explains what data is stored, why it's stored, how it's kept safe, and the process of deleting it."
}


export default () => (
  <main className="w-full max-w-[1400px] min-h-screen py-8 lg:py-16 px-8 lg:px-16 mx-auto">
    <div className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight">{metadata.title?.toString().replace(" - Phase Bot", "")}</h1>
      <p className="text-lg text-muted-foreground">{metadata.description}</p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">What data we store</h2>
      <p className="leading-7">
        When you use the bot's commands or modules in any server, we may sometimes store data in our database - this is usually limited to just your user ID. When you add the bot to one of your servers, we will save the ID of the server in our database so it can be configured on the dashboard. When you log into our dashboard with your Discord account, in order for it to work, we need to store your OAuth2 credentials, which are required to fetch data about your account.
      </p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Why we store data</h2>
      <p className="leading-7">
        Many parts of the bot require data from Discord to work. An example of this is the Levels module, which saves the IDs of users in the database to keep track of their levels. If we didn't save the ID of the user, there would be no way to find and update the user's level data since the user ID is used as an index. This is a common way to index user-related data and the same will be true for almost all Discord bots that utilise databases.
      </p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">How we keep data safe</h2>
      <p className="leading-7">
        We have 2 databases. One database is for bot-related operations, for example module configuration, and the other is for dashboard-related operations, for example authentication. Database credentials are kept highly secure, and therefor are unlikely to be exposed, however in the event of exposure, they will swiftly be invalidated and we will do everything we can to make sure no data was breached. If data was found to be breached, we will make sure we inform all effected users, and in the case of authentication data being breached, we will also revoke <strong>all</strong> OAuth2 credentials we have stored.
      </p>
      <p className="leading-7">
        We are always looking for ways to make our data even more secure, and we regularly update our code to try and do just that. However, if you believe you have found a security vulnerability in our code, we encourage you to responsibly disclose this and not open a public issue. We will investigate all legitimate reports. Contact the developers in a <strong><Link href={"/redirect/discord"} className="underline">support ticket</Link></strong> to disclose any security vulnerabilities.
      </p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">How to delete your data</h2>
      <p className="leading-7">
        If you want to delete all the data pertaining to your server, simply remove the bot and it will be automatically deleted from the database. If you want to delete your own OAuth2 credentials from the database, you can do so through the dashboard under your account settings - this will sign you out. If you want your data to be removed from <strong>all</strong> servers in our database, we'll need to do that manually, so you'll have to open a <strong><Link href={"/redirect/discord"} className="underline">support ticket</Link></strong>.
      </p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Last Updated</h2>
      <p className="leading-7">
        10th of January, 2024
      </p>
    </div>
  </main>
)
