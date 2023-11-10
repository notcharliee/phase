import Link from 'next/link'

import QuickNavigate from '@/components/QuickNavigate'

import axios from 'axios'
import discord_api_types_v10 from 'discord-api-types/v10'


// Exporting route group layout

export default async ({ children }: { children: React.ReactNode }) => {

  // const commandArray = await axios.get<discord_api_types_v10.RESTGetAPIApplicationCommandsResult>(process.env.BASE_URL + '/api/bot/commands')

  return (
    <div className='min-h-dvh bg-dark-900 font-poppins text-light-800 flex flex-col md:flex-row gap-3 p-6'>
      <div className='min-h-full max-h-[calc(100vh-48px)] flex flex-col gap-3'>
        <div className='p-3 border border-dark-600 rounded flex items-center justify-between'>
          <Link href='/docs' className="text-xl font-bold">
            <span>phase</span>
            <span className="text-phase">docs</span>
          </Link>
          <QuickNavigate text='min'></QuickNavigate>
        </div>
        <nav className='min-w-[280px] h-full overflow-y-auto scrollbar-float p-3 border border-dark-600 rounded hidden md:flex flex-col gap-6'>
          <div className='flex flex-col gap-3'>
          <div>
              <Link href='/docs' className='font-semibold text-lg duration-150 hover:underline underline-offset-4 decoration-phase'>Introduction</Link>
              <div className='text-light-100 flex flex-col pl-1 mt-1.5 leading-6 text-sm'>
                <Link className='hover:text-phase duration-150' href='/docs#what-is-phase'>What is Phase?</Link>
                <Link className='hover:text-phase duration-150' href='/docs#why-should-i-use-phase'>Why should I use Phase?</Link>
              </div>
            </div>
            <div>
              <Link href='/docs/modules' className='font-semibold text-lg duration-150 hover:underline underline-offset-4 decoration-phase'>Modules</Link>
              <div className='text-light-100 flex flex-col pl-1 mt-1.5 leading-6 text-sm'>
                <Link className='hover:text-phase duration-150' href='/docs/modules#afks'>AFKs</Link>
                <Link className='hover:text-phase duration-150' href='/docs/modules#auditlogs'>Audit Logs</Link>
                <Link className='hover:text-phase duration-150' href='/docs/modules#autopartners'>Auto Partners</Link>
                <Link className='hover:text-phase duration-150' href='/docs/modules#autoroles'>Auto Roles</Link>
                <Link className='hover:text-phase duration-150' href='/docs/modules#giveaways'>Giveaways</Link>
                <Link className='hover:text-phase duration-150' href='/docs/modules#jointocreate'>Join to Create</Link>
                <Link className='hover:text-phase duration-150' href='/docs/modules#levels'>Levels & XP</Link>
                <Link className='hover:text-phase duration-150' href='/docs/modules#reactionroles'>Reaction Roles</Link>
                <Link className='hover:text-phase duration-150' href='/docs/modules#tickets'>Tickets</Link>
              </div>
            </div>
            <div>
              <Link href='/docs/commands' className='font-semibold'>Commands</Link>
              <div className='text-light-100 flex flex-col pl-2 mt-1.5 leading-6 text-sm'>
                {/* {commandArray.data.map((command, key) => {
                  return <Link key={key} href={`/docs/commands/${command.name}`}>/{command.name}</Link>
                })} */}
              </div>
            </div>
          </div>
        </nav>
      </div>
      <main className='w-full flex-grow md:max-h-[calc(100vh-48px)] overflow-y-auto scroll-smooth scroll-pt-6 scrollbar-float p-6 bg-grid border border-dark-600 rounded break-words'>
        {children}
      </main>
    </div>
  )

}