import Image from "next/image"
import { headers } from "next/headers"
import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"
import { env } from '@/env'

export default async () => {
  const discordREST = new REST().setToken(env.DISCORD_TOKEN)
  const discordAPI = new API(discordREST)

  const userId = headers().get("x-user-id")!
  const user = await discordAPI.users.get(userId)
  const userAvatar = user.avatar
    ? discordREST.cdn.avatar(user.id, user.avatar)
    : null

  return (
    <div className="bg-dark-800 border-2 border-dark-400 rounded-xl p-6 h-full flex flex-col gap-4">
      <div className="flex gap-5 items-center">
        <Image
          src={userAvatar ?? "/discord.png"}
          width={72}
          height={72}
          alt=""
          className="rounded"
        />
        <div className="flex flex-col text-lg leading-none gap-1">
          <span className="text-xl font-semibold">{user.global_name}</span>
          <span className="text-light-100">{user.username}</span>
        </div>
      </div>
      <div className="grid min-[0px]:grid-rows-3 min-[500px]:grid-rows-none min-[500px]:grid-cols-3 sm:grid-cols-none sm:grid-rows-3 min-[900px]:grid-rows-none min-[900px]:grid-cols-3 gap-4 text-sm">
        <button className="rounded bg-dark-100/75 hover:bg-dark-100 active:scale-95 duration-200 p-3">Sign Out</button>
        <button className="rounded bg-dark-100/75 hover:bg-dark-100 active:scale-95 duration-200 p-3">View Token</button>
        <button className="rounded bg-phase active:scale-95 duration-200 p-3">Delete Data</button>
      </div>
    </div>
  )
}
