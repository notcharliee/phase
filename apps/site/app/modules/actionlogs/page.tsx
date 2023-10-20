// next
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// utils
import { API, ChannelType } from '@/utils/discord'
import * as db from '@/utils/database'
import isAuthorised from '@/utils/authorised'

// components
import { ChannelDropdown } from '@/utils/components'
import UpdateModuleData from '../_components/UpdateModuleData'

// packages
import { Routes, APIGuildChannelResolvable } from 'discord-api-types/rest/v10'


export const metadata = { title: 'Action Logs' }

export default async function page({ searchParams }: { searchParams: { guild: string } }) {

    // check if user is authorised
    let authorised = await isAuthorised(cookies().get('session')?.value, searchParams.guild)
    if(!authorised) return redirect(process.env.BASE_URL + '/redirect/login')

    // initialise the api
    let discordApi = new API()

    // fetch and filter channels
    let channels = await discordApi.fetch<APIGuildChannelResolvable[]>(Routes.guildChannels(searchParams.guild))
    let filteredChannels = channels.filter((channel) => { return channel.type == ChannelType.GuildText }).sort((a: APIGuildChannelResolvable, b: APIGuildChannelResolvable) => { return a.position - b.position })


    // action forms

    async function saveData(formData: FormData) {
        'use server'

        let defaultChannel = formData.get('defaultChannel')?.toString()
        let inviteChannel = formData.get('inviteChannel')?.toString()
        let logsDB = await db.logs.findOne({ guild: searchParams.guild })

        if(logsDB) {
            logsDB.channel = defaultChannel || ''

            logsDB.options.invite.use.channel = inviteChannel || ''
            logsDB.options.invite.use.enabled = true

            logsDB.markModified('options.invite.use')
            logsDB.save()
        }
        else { 
            new db.logs({ 
                guild: searchParams.guild,
                channel: defaultChannel,
                options: {
                    invite: {
                        use: { channel: inviteChannel || '', enabled: true },
                        create: { channel: '', enabled: false },
                        delete: { channel: '', enabled: false },
                    },
                },
            }).save()
        }
    }

    async function deleteData(formData: FormData) {
        'use server'

        let logsDB = await db.logs.findOne({ guild: searchParams.guild })
        if(logsDB) logsDB.deleteOne().then(() => {
            redirect(`/modules/actionlogs?guild=${searchParams.guild}&refresh=true`)
        })
    }


    let logsDB = await db.logs.findOne({ guild: searchParams.guild })

    return (
        <form className='flex flex-col gap-8 items-start justify-start self-center min-h-[calc(100vh-12rem)] max-w-4xl w-full' action={saveData}>
            <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>
                Modules/<span className='gradient-text'>{metadata.title}</span>
            </h2>

            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Default Channel</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Set a default channel for all logs to be sent to.</p>
                <ChannelDropdown
                    channels={filteredChannels}
                    name='defaultChannel'
                    required={false}
                    channelName={
                        channels.find(
                            (channel) => channel.id == logsDB?.channel
                        )?.name
                    }
                    channelId={logsDB?.channel}
                ></ChannelDropdown>
            </div>
            
            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Invite Events</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Set a channel for all invite-related logs to be sent to.</p>
                <ChannelDropdown
                    channels={filteredChannels}
                    name='inviteChannel'
                    required={false}
                    channelName={
                        channels.find(
                            (channel) => channel.id == logsDB?.options.invite.use.channel
                        )?.name
                    }
                    channelId={logsDB?.options.invite.use.channel}
                ></ChannelDropdown>
            </div>

            <i className='font-semibold text-sm text-[0.75rem] text-neutral-400'>More Options Coming Very Soon!</i>

            <UpdateModuleData deleteData={deleteData}></UpdateModuleData>
        </form>
    )
}
