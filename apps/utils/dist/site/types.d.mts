import * as discord_api_types_v10 from 'discord-api-types/v10';

type AuthorisedUser = {
    identity: discord_api_types_v10.APIUser;
    guilds: discord_api_types_v10.RESTGetAPICurrentUserGuildsResult;
    session: `${string}-${string}-${string}-${string}-${string}`;
    token: discord_api_types_v10.RESTPostOAuth2AccessTokenResult;
    timestamp: string;
};

export { AuthorisedUser };
