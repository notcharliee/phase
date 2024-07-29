import { createHmac } from "crypto"

import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { ChatBubbleIcon, ReloadIcon } from "@radix-ui/react-icons"

import {
  LoginMethods,
  ServerSelect,
  SetSearchParams,
} from "~/components/auth/login"
import { Loading } from "~/components/loading"
import { OrbitingDots } from "~/components/orbiting-dots"
import { Button } from "~/components/ui/button"
import { Codeblock } from "~/components/ui/codeblock"

import { createCookie } from "~/lib/auth"
import { database } from "~/lib/db"
import { env } from "~/lib/env"
import { absoluteURL } from "~/lib/utils"

interface LoginPageProps {
  searchParams: {
    code: string | undefined
    access_token: string | undefined
  }
}

export default async function LoginPage(props: LoginPageProps) {
  const code = props.searchParams.code
  const accessToken = props.searchParams.access_token

  const onSubmit = async (value: string) => {
    "use server"

    const db = await database.init()

    const signature = createHmac("sha256", env.AUTH_OTP_SECRET)
      .update(value)
      .digest("hex")

    const optDoc = await db.otps.findOneAndDelete({ otp: signature })
    if (!optDoc) throw new Error("Invalid OTP")

    createCookie(cookies(), {
      userId: optDoc.userId,
      guildId: optDoc.guildId,
    })
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <OrbitingDots />
      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center space-y-6 md:max-w-xl md:space-y-8">
        {(code ?? accessToken) ? (
          <Suspense fallback={<Loading />}>
            <LoginCallback code={code} accessToken={accessToken} />
          </Suspense>
        ) : (
          <>
            <div className="text-balance text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Welcome back!
              </h1>
              <p className="text-muted-foreground mt-2 md:text-lg">
                To access the dashboard, either run the{" "}
                <Codeblock className="md:text-sm" inline>
                  /bot login
                </Codeblock>{" "}
                command, or click the button below to login with your Discord
                account.
              </p>
            </div>
            <LoginMethods onSubmit={onSubmit} />
          </>
        )}
      </div>
    </div>
  )
}

interface LoginCallbackPageProps {
  code?: string
  accessToken?: string
}

async function LoginCallback(props: LoginCallbackPageProps) {
  const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  const discordAPI = new API(discordREST)

  const accessToken = props.accessToken
    ? props.accessToken
    : props.code
      ? ((
          await discordAPI.oauth2
            .tokenExchange({
              client_id: env.DISCORD_ID,
              client_secret: env.DISCORD_SECRET,
              grant_type: "authorization_code",
              redirect_uri: env.NEXT_PUBLIC_BASE_URL + "/auth/login",
              code: props.code,
            })
            .catch(() => null)
        )?.access_token ?? null)
      : null

  if (!accessToken) return <LoginFailure />

  const user = await new API(
    new REST({ authPrefix: "Bearer" }).setToken(accessToken),
  ).users
    .getCurrent()
    .catch(() => null)

  if (!user) return <LoginFailure />

  const db = await database.init()

  const guilds = await Promise.all(
    (await db.guilds.find({ admins: { $in: user.id } })).flatMap((guild) =>
      discordAPI.guilds
        .get(guild.id as string, { with_counts: false })
        .then((guild) => ({
          id: guild.id,
          name: guild.name,
          icon_url: guild.icon
            ? discordREST.cdn.icon(guild.id, guild.icon)
            : null,
        })),
    ),
  )

  const onSubmit = async (guildId: string) => {
    "use server"

    createCookie(cookies(), {
      userId: user.id,
      guildId,
    })

    const headers = new Headers()
    headers.append("Content-Type", "application/x-www-form-urlencoded")
    headers.append(
      "Authorization",
      "Basic " + btoa(`${env.DISCORD_ID}:${env.DISCORD_SECRET}`),
    )

    const body = new URLSearchParams({
      token: accessToken,
      token_type_hint: "access_token",
    })

    const response = await fetch(
      "https://discord.com/api/oauth2/token/revoke",
      {
        method: "POST",
        headers: headers,
        body: body,
      },
    ).catch(() => null)

    if (response?.ok) {
      redirect(absoluteURL("/dashboard/modules"))
    } else {
      throw new Error("Failed to revoke access token")
    }
  }

  return (
    <>
      <div className="text-balance text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2 md:text-lg">
          Select the server you want to manage, then click the button below to
          enter the dashboard.
        </p>
      </div>
      <ServerSelect guilds={guilds} onSubmit={onSubmit} />
      <SetSearchParams accessToken={accessToken} />
    </>
  )
}

function LoginFailure() {
  return (
    <>
      <div className="text-balance text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Authorisation Failed
        </h1>
        <p className="text-muted-foreground mt-2 md:text-lg">
          The authorisation code we received was invalid. Try logging in again,
          and if the problem persists, please make a support ticket.
        </p>
      </div>
      <div className="w-72 space-y-4 md:w-[336px]">
        <Button size={"lg"} className="w-full gap-2" asChild>
          <Link href={"/redirect/oauth"}>
            <ReloadIcon className="h-5 w-5" />
            Attempt login again
          </Link>
        </Button>
        <Button variant="outline" size={"lg"} className="w-full gap-2" asChild>
          <Link href={"/redirect/discord"}>
            <ChatBubbleIcon className="h-5 w-5" />
            Make a support ticket
          </Link>
        </Button>
      </div>
    </>
  )
}
