import { cookies, headers } from "next/headers"
import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { env } from '@/env'
import Link from "next/link"
import Image from "next/image"
import Modal from "@/components/Modal"


export const metadata = {
  title: "Dashboard - Phase",
}


export default async () => {
  const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  const discordAPI = new API(discordREST)

  const userId = headers().get("x-user-id")!
  const userCookie = cookies().get("auth_session")!

  const user = await discordAPI.users.get(userId)

  const discordUserBanner = user.banner
    ? discordREST.cdn.banner(user.id, user.banner)
    : "/discord.png"
    
  const discordUserAvatar = user.avatar
    ? discordREST.cdn.avatar(user.id, user.avatar)
    : "/discord.png"

  return (
    <div className="w-full max-w-[450px] rounded border border-dark-600 bg-dark-700 shadow">
      <div className="relative mb-[70px]">
        <Image
          src={discordUserBanner}
          width={450}
          height={150}
          alt=""
          className="max-h-[150px] min-h-[150px] w-full rounded-tl rounded-tr"
        ></Image>
        <Image
          src={discordUserAvatar}
          width={120}
          height={120}
          alt=""
          className="absolute left-4 top-[90px] rounded-full border-8 border-dark-700"
        ></Image>
      </div>
      <div className="m-4 flex flex-col rounded bg-dark-800 p-4">
        <span className="text-lg font-semibold">{user.global_name}</span>
        <span className="text-sm font-semibold text-light-100">
          {user.username}
        </span>
        <div className="mt-4 flex flex-col text-sm">
          <span className="font-semibold">
            User ID<span className="ml-2 text-light-100">{user.id}</span>
          </span>
          <span className="font-semibold">
            User Token
            <Modal
              button={
                <span className="ml-2 cursor-pointer select-none font-semibold text-blue-500 underline-offset-2 hover:underline">
                  Click to view
                </span>
              }
              heading={
                <h3 className="text-xl font-bold text-light-900">User Token</h3>
              }
            >
              <div className="font-medium text-light-100">
                <p className="mt-2">
                  This is your current user token.
                  <br />
                  <br />
                  Each time you reauthenticate, even if using the same account,
                  a new token will be generated.
                  <br />
                  <br />
                  Tokens are used to authenticate your requests to our API &
                  Dashboard. For API docs,{" "}
                  <Link href="/docs/api" className="text-blue-500">
                    click here.
                  </Link>
                </p>
                <h3 className="mt-6 text-xl font-bold text-light-900">
                  Important Warning
                </h3>
                <p className="mt-2 text-[#FF5656]">
                  Never share this token with <u>anyone</u>, as it can be used to make
                  changes to your servers/account.
                </p>
                <div className="mt-6 w-full rounded bg-dark-800 p-3 pl-4 pr-4 font-medium text-light-100">
                  {userCookie.value}
                </div>
              </div>
            </Modal>
          </span>
        </div>
      </div>
    </div>
  )
}
