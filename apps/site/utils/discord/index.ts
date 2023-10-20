// classes
import { PermissionsBitField } from '@/utils/discord/classes/PermissionsBitField'

// enums
import { ChannelType } from './enums/ChannelType'

// types
import { RankUser } from './types/RankUser'

// utils
import * as db from '@/utils/database'

// packages
import { randomUUID as uuidv4 } from 'crypto'
import { Routes, RESTPostOAuth2AccessTokenResult, RESTGetAPICurrentUserResult, RESTGetAPICurrentUserGuildsResult, RESTGetAPIUserResult } from 'discord-api-types/rest/v10'


class API {
    private botToken: string | undefined = process.env.DISCORD_TOKEN

    /**
     * Runs a fetch request from the Discord API
     *
     * @param endpoint - The API endpoint
     * @param fetchOptions - Optional request options
     */
    async fetch<Result, Body extends any = undefined>(endpoint: `/${string}`, fetchOptions?: {
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        headers?: HeadersInit,
        body?: Body
    }): Promise<Result> {

        if(!this.botToken) throw new Error('Could not find \'login\' environment variable.')

        let method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = fetchOptions?.method || 'GET'
        let headers: HeadersInit = { 'Authorization': `Bot ${this.botToken}`, 'Content-Type': 'application/json' }
        let body = fetchOptions?.body

        Object.assign(headers, fetchOptions?.headers || {})

        // @ts-ignore
        let response = await fetch(`https://discord.com/api/v10${String(endpoint)}`, { method, headers, body })

        if(!response.ok) throw new Error(`Request to endpoint failed with status ${response.status}`)
        return response.json() as Promise<Result>

    }

    /**
     * Gets a user from the Discord API
     *
     * @param code - The user code
     * @param grant_type - The type of user code provided
     * @param scope - What scopes to request
     */
    async getUser(
            code: string,
            grant_type: 'session_id' | 'refresh_token' | 'authorization_code' | 'user_id',
            scope: { identity: boolean, guilds: boolean
        } = {
            identity:false, guilds:false
        }): Promise<{
            user: RESTGetAPIUserResult | undefined,
            guilds: RESTGetAPICurrentUserGuildsResult  | undefined, 
            session_id: string | undefined
        }> {

        let client_id: string = process.env.DISCORD_ID!
        let client_secret: string = process.env.DISCORD_SECRET!

        try {

            if(grant_type == 'user_id') {

                if(scope.identity || scope.guilds) throw new Error('Scopes cannot be selected with a User ID grant type.')

                let userData = await this.fetch<RESTGetAPIUserResult>(Routes.user(code))

                return { user: userData, guilds: undefined, session_id: undefined }

            }


            let token = await this.fetch<RESTPostOAuth2AccessTokenResult, URLSearchParams>(Routes.oauth2TokenExchange(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id,
                    client_secret,
                    code: grant_type == 'refresh_token' || 'authorization_code' ? code : (await db.logins.findOne({ session_id: code }))?.refresh_token || '',
                    redirect_uri: process.env.BASE_URL + '/api/login',
                    grant_type: grant_type == 'authorization_code' ? grant_type : 'refresh_token',
                    scope: 'identity guilds'
                })
            })
    
            let { access_token, refresh_token, token_type } = token
    
            let user
            let guilds
    
            if(scope.identity) {
                user = await this.fetch<RESTGetAPICurrentUserResult>(Routes.user(), {
                    method: 'GET',
                    headers: { 'Authorization': `${token_type} ${access_token}` }
                })
            }
    
            if(scope.guilds) {
                guilds = await this.fetch<RESTGetAPICurrentUserGuildsResult>(`${Routes.userGuilds()}?with_counts=true`, {
                    method: 'GET',
                    headers: { 'Authorization': `${token_type} ${access_token}` }
                })
            }
    
            let session_id = uuidv4() as string
            let schema = await db.logins.findOne({ 'user.id': user?.id })
    
            if(schema) {
                if(user) schema.user = user
                if(guilds) schema.guilds = guilds
    
                schema.refresh_token = refresh_token
                session_id = schema.session_id
    
                schema.save()
            } else {
                new db.logins({
                    user,
                    guilds,
                    session_id,
                    refresh_token
                }).save()
            }
    
            return { user, guilds, session_id }

        } catch(error) {
            throw new Error(`${error}`)
        }

    }
}


export {
    API,
    PermissionsBitField,
    ChannelType,
}

export type {
    RankUser,
}