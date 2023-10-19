// next
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// utils
import isAuthorised from '@/utils/authorised'

// components
import DeleteAccount from './_components/DeleteAccount'

// functions
import getBadges from './_functions/badges'

// packages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solid from '@fortawesome/free-solid-svg-icons'


export const metadata = { title: 'Account' }
export const dynamic = 'force-dynamic'

export default async function page() {

    // check if user is authorised
    let session = cookies().get('session')?.value
    let authorised = await isAuthorised(session)
    if(!authorised) return redirect(process.env.url + '/redirect/login')

    let { user, guilds } = authorised

    return (
        <>
            <div className='flex flex-col gap-8 items-center justify-center self-center min-h-[calc(100vh-12rem)] max-w-4xl w-full'>
                <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>Your Account</h2>
                <div className='flex flex-col bg-neutral-900 rounded-md max-w-lg w-full'>
                    <div className='relative overflow-hidden rounded-md bg-neutral-800'>
                        <div className='w-full h-full flex flex-col relative'>
                            <div className='flex items-center justify-center w-full h-36'>
                                {user.banner ? 
                                    <div className='w-full h-full bg-neutral-800 inset-0 opacity-80 blur-sm z-10' style={{ background: `url(https://cdn.discordapp.com/banners/${user.id}/${user.banner}?size=4096) center center/cover no-repeat` }}></div> :
                                    <div className='w-full h-full bg-neutral-800 scale-105 inset-0 opacity-80 blur-sm z-10' style={{ background: `url(https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=4096) center center/cover no-repeat` }}></div>
                                }
                                <Image
                                    src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=4096` : '/discord.png'}
                                    alt='Guild Icon'
                                    width={96}
                                    height={96}
                                    className='rounded-full absolute z-20 bg-neutral-950 text-neutral-950'
                                    placeholder="blur"
                                    blurDataURL={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=4096` : '/discord.png'}
                                />
                            </div>
                            <div className='flex flex-col items-start justify-center w-full h-1/2 z-20 p-4 bg-neutral-900'>
                                <div className='flex items-start justify-between w-full'>
                                    <span className='truncate text-base font-semibold select-none sm:text-lg'>{user.global_name}</span>
                                    <span className='flex'>
                                        {getBadges(user.premium_type, user.public_flags).map((badgeURL, index) => {
                                            return (
                                                <Image
                                                    src={badgeURL}
                                                    alt='Badge Icon'
                                                    width={20}
                                                    height={20}
                                                    className='w-5 h-5 m-0.5'
                                                    key={index}
                                                />
                                            )
                                        })}
                                    </span>
                                </div>
                                <span className='flex gap-1 items-center font-semibold text-sm text-[0.75rem] text-neutral-400'>{user.username}</span>
                                <div className='mt-4 flex flex-col gap-2'>
                                    <div>
                                        <span className='flex gap-1 items-center w-full font-semibold text-sm text-white'>
                                            <FontAwesomeIcon icon={solid.faUser} width={14} height={14}></FontAwesomeIcon>
                                            User ID
                                        </span>
                                        <strong className='text-sm text-neutral-400'>{user.id}</strong>
                                    </div>
                                    <div>
                                        <span className='flex gap-1 items-center w-full font-semibold text-sm text-white'>
                                            <FontAwesomeIcon icon={solid.faCookieBite} width={14} height={14}></FontAwesomeIcon>
                                            Session ID
                                        </span>
                                        <strong className='text-sm text-neutral-400'>{session}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-8 items-center justify-center self-center min-h-[calc(100vh-12rem)] max-w-4xl'>
                <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>Your Servers</h2>
                <div className='flex flex-wrap gap-8 justify-center m-8'>
                    {guilds.map((guild, index) => { return (
                        <div className='relative overflow-hidden rounded-md bg-neutral-800' key={index}>
                            <div className='w-64 h-48 flex flex-col relative'>
                                <div className='flex items-center justify-center w-full h-1/2'>
                                    <div className='w-full h-full bg-neutral-800 scale-105 inset-0 opacity-80 blur-sm z-10' style={{ background: `url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=4096) center center/cover no-repeat` }}></div>
                                    <Image
                                        src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=4096` : '/discord.png'}
                                        alt='Guild Icon'
                                        width={64}
                                        height={64}
                                        className='rounded-full absolute z-20 bg-neutral-950 text-neutral-950'
                                        placeholder="blur"
                                        blurDataURL={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=4096` : '/discord.png'}
                                    />
                                </div>
                                <div className='flex flex-col items-start justify-center w-full h-1/2 z-20 p-4 bg-neutral-900'>
                                    <div className='flex items-start justify-start w-full'>
                                        <span className='truncate text-base font-semibold select-none sm:text-lg'>{guild.name}</span>
                                    </div>
                                    <div>
                                        <span className='flex gap-1 items-center font-semibold text-[0.75rem] text-neutral-400'>
                                            <FontAwesomeIcon icon={solid.faCircle} width={8} height={8} className='text-[#3ba55d]'></FontAwesomeIcon>
                                            {guild.approximate_presence_count} Online
                                        </span>
                                        <span className='flex gap-1 items-center font-semibold text-[0.75rem] text-neutral-400'>
                                            <FontAwesomeIcon icon={solid.faCircle} width={8} height={8} className='text-[#747f8d]'></FontAwesomeIcon>
                                            {guild.approximate_member_count} Members
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
            <div className='flex flex-col gap-8 items-center justify-center self-center min-h-[calc(100vh-12rem)] max-w-4xl'>
                <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>Danger Zone</h2>
                <p className='font-semibold max-w-[777px] text-center text-lg sm:text-xl'>In accordance with <Link href='https://gdpr-info.eu' target='_blank' className='gradient-text'>GDPR</Link>, you can use this button to log out and wipe your data from our servers.</p>
                <DeleteAccount session={session}></DeleteAccount>
            </div>
        </>
    )
}