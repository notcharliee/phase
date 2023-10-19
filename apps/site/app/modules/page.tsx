// next
import { cookies } from 'next/headers'

// utils
import isAuthorised from '@/utils/authorised'

// components
import GuildSelect from './_components/GuildSelect'
import Module from './_components/Module'

// constants
import { modulesArray } from './_constants/modules'


export const metadata = { title: 'Modules' }

export default async function page({ searchParams }: { searchParams: { guild: string } }) {

    let authorised = await isAuthorised(cookies().get('session')?.value, searchParams.guild)
    
    return (
        <div className='w-full max-w-[1536px] p-8 flex flex-col justify-start gap-32 min-h-[calc(100vh-6rem)] relative'>
            <div className='flex flex-col gap-8 items-center justify-center self-center max-w-4xl min-h-[calc(50vh-12rem)]'>
                <h2 className='font-lilita uppercase max-w-[450px] gradient-text text-5xl select-none text-center sm:text-6xl sm:self-center'>Modules</h2>
                <p className='font-semibold max-w-[777px] text-center text-lg sm:text-xl'>Take your Phase experience to the next level with Modules. Expand and personalize the bot according to your server's unique needs.</p>
                <div className='flex flex-col gap-2 w-[249.33px] sm:w-[280px]'>{authorised ?
                    <GuildSelect guilds={authorised.authorisedGuilds} guild={searchParams.guild ? authorised.authorisedGuilds.find(guild => guild.id == searchParams.guild) : undefined}></GuildSelect> : <GuildSelect guilds={[]} disabled></GuildSelect>
                }</div>
            </div>
            <div className='flex flex-wrap gap-8 justify-center'>
                {modulesArray.map((module, i) => {
                    return <Module
                        name={module.name}
                        id={module.id}
                        description={module.description}
                        type={module.type}
                        complexity={module.complexity}
                        guild={searchParams.guild}
                        key={i}
                    ></Module>
                })}
            </div>
        </div>
    )

}