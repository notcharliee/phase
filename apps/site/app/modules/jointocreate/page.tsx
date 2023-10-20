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


export const metadata = { title: 'Join to Create' }

export default async function page({ searchParams }: { searchParams: { guild: string } }) {

    // check if user is authorised
    let authorised = await isAuthorised(cookies().get('session')?.value, searchParams.guild)
    if(!authorised) return redirect(process.env.BASE_URL + '/redirect/login')

    // initialise the api
    let discordApi = new API()

    // fetch and filter channels
    let channels = await discordApi.fetch<APIGuildChannelResolvable[]>(Routes.guildChannels(searchParams.guild))
    let voiceChannels = channels.filter((channel) => { return channel.type == ChannelType.GuildVoice }).sort((a: APIGuildChannelResolvable, b: APIGuildChannelResolvable) => { return a.position - b.position })
    let categoryChannels = channels.filter((channel) => { return channel.type == ChannelType.GuildCategory }).sort((a: APIGuildChannelResolvable, b: APIGuildChannelResolvable) => { return a.position - b.position })


    // action forms

    async function saveData(formData: FormData) {
        'use server'

        let voiceChannel = formData.get('voiceChannel')?.toString()
        let voiceCategory = formData.get('voiceCategory')?.toString()
        let jointocreateDB = await db.jointocreate.findOne({ guild: searchParams.guild })

        if(jointocreateDB) {
            jointocreateDB.channel = voiceChannel || ''
            jointocreateDB.category = voiceCategory || ''

            jointocreateDB.save()
        }
        else { 
            new db.jointocreate({ 
                guild: searchParams.guild,
                channel: voiceChannel,
                category: voiceCategory
            }).save()
        }
    }

    async function deleteData(formData: FormData) {
        'use server'

        let jointocreateDB = await db.jointocreate.findOne({ guild: searchParams.guild })
        if(jointocreateDB) jointocreateDB.deleteOne().then(() => {
            redirect(`/modules/jointocreate?guild=${searchParams.guild}&refresh=true`)
        })
    }


    let jointocreateDB = await db.jointocreate.findOne({ guild: searchParams.guild })

    return (
        <form className='flex flex-col gap-8 items-start justify-start self-center min-h-[calc(100vh-12rem)] max-w-4xl w-full' action={saveData}>
            <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>
                Modules/<span className='gradient-text'>{metadata.title}</span>
            </h2>

            {/* Voice Channel */}
            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Voice Channel</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Set a voice channel users will need to join to create their VCs.</p>
                <ChannelDropdown
                    channels={voiceChannels}
                    name='voiceChannel'
                    required={false}
                    channelName={
                        channels.find(
                            (channel) => channel.id == jointocreateDB?.channel
                        )?.name
                    }
                    channelId={jointocreateDB?.channel}
                ></ChannelDropdown>
            </div>
            
            {/* Voice Category */}
            <div className='flex flex-col gap-4 bg-neutral-900 rounded-md p-4 w-full'>
                <h3 className='text-xl font-bold'>Voice Category</h3>
                <p className='font-semibold text-sm text-[0.75rem] text-neutral-400'>Set a category for user VCs to be created in.</p>
                <ChannelDropdown
                    channels={categoryChannels}
                    name='voiceCategory'
                    required={false}
                    channelName={
                        channels.find(
                            (channel) => channel.id == jointocreateDB?.category
                        )?.name
                    }
                    channelId={jointocreateDB?.category}
                ></ChannelDropdown>
            </div>

            <UpdateModuleData deleteData={deleteData}></UpdateModuleData>
        </form>
    )
}
