import discord_api_types_v10 from 'discord-api-types/v10'

export type AuthorisedUser = {
  id: string,
  session: `${string}-${string}-${string}-${string}-${string}`,
  token: discord_api_types_v10.RESTPostOAuth2AccessTokenResult,
  timestamp: string,
}