import { headers, cookies } from "next/headers"
import { Guild } from "./guild"
import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"

export default async () => {
  const userToken = headers().get("x-user-token")!
  const userREST = new REST({ "authPrefix": "Bearer" }).setToken(userToken)
  const userAPI = new API(userREST)
  const userGuilds = await userAPI.users.getGuilds()

  const selectedGuild = cookies().get("selected_guild")?.value
  const validSelectedGuild = !!(selectedGuild && userGuilds.some(userGuild => userGuild.id == selectedGuild)) ? selectedGuild : ""
  
  return (
    <div className="bg-dark-800 border-2 border-dark-400 rounded-xl p-6 flex flex-col gap-4 max-h-[260px] sm:max-h-[304px] min-[900px]:max-h-[184px] w-full">
      <div className="flex flex-wrap gap-5 items-center overflow-auto">
        {userGuilds.map((userGuild, key) => (
          <Guild 
            key={key}
            selected={validSelectedGuild}
            guild={{
              id: userGuild.id,
              name: userGuild.name,
              icon: userGuild.icon ? userREST.cdn.icon(userGuild.id, userGuild.icon, { forceStatic: true }) : "/discord.png",
            }}
          />
        ))}
      </div>
    </div>
  )
}
