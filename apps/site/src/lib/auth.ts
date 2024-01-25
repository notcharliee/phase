import { API } from "@discordjs/core/http-only"
import { REST } from "@discordjs/rest"


/**
 * Checks if the user id and user token are valid and returns a user object.
 * 
 * @param userId The user ID
 * @param userToken The user access token
 */
export const getUser = async (userId: string, userToken: string) => {
  const userREST = new REST({ authPrefix: "Bearer" }).setToken(userToken)
  const userAPI = new API(userREST)

  const user = await userAPI.users.getCurrent()

  if (user.id !== userId) return null

  return user
}