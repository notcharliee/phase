import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as FaRegular from '@fortawesome/free-regular-svg-icons'

import SidebarDropdown from '@/components/SidebarDropdown'
import SidebarLink from '@/components/SidebarLink'


// Exporting route group layout

export default ({ children }: { children: React.ReactNode }) => {

  return (
    <div className='min-h-dvh bg-dark-900 font-poppins text-light-800 flex flex-col md:flex-row gap-6 p-6'>
      <nav className='min-w-[280px] min-h-full max-h-[calc(100vh-48px)] overflow-y-auto bg-dark-800 p-4 border border-dark-600 rounded hidden md:flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <SidebarLink icon={FaRegular.faUser} title='account' href='/dashboard'></SidebarLink>
          <SidebarLink icon={FaRegular.faCommentAlt} title='guilds' href='/dashboard/guilds'></SidebarLink>
          <SidebarLink icon={FaRegular.faFolder} title='documentation' href='/docs'></SidebarLink>
        </div>
        <div className='flex flex-col gap-4'>
          <SidebarDropdown icon={FaRegular.faFloppyDisk} title='modules' items={[
            <Link href='/dashboard/modules/afks'>AFKs</Link>,
            <Link href='/dashboard/modules/auditlogs'>Audit Logs</Link>,
            <Link href='/dashboard/modules/autopartners'>Auto Partners</Link>,
            <Link href='/dashboard/modules/autoroles'>Auto Roles</Link>,
            <Link href='/dashboard/modules/giveaways'>Giveaways</Link>,
            <Link href='/dashboard/modules/jointocreate'>Join to Create</Link>,
            <Link href='/dashboard/modules/levels'>Levels & XP</Link>,
            <Link href='/dashboard/modules/reactionroles'>Reaction Roles</Link>,
            <Link href='/dashboard/modules/reactionroles'>Tickets</Link>,
          ]}></SidebarDropdown>
          <SidebarDropdown icon={FaRegular.faHardDrive} title='commands' items={[
            <Link href='/docs/commands'>Documentation</Link>,
          ]}></SidebarDropdown>
          <SidebarDropdown icon={FaRegular.faPenToSquare} title='forms' items={[
            <Link href='/docs/forms'>Documentation</Link>,
          ]}></SidebarDropdown>
        </div>
        <div className='flex flex-col gap-4 mt-auto'>
          <Link href='/' className='w-full bg-dark-900 text-light-100 select-none cursor-pointer font-medium p-3 pl-4 pr-4 rounded shadow border border-dark-800'>
            <FontAwesomeIcon icon={FaRegular.faCircleXmark} className='w-4 h-4 mr-2.5 inline-block'></FontAwesomeIcon>
            exit dashboard
          </Link>
        </div>
      </nav>
      <main className='w-full md:max-w-[calc(100vw-352px)] min-h-[calc(100dvh-48px)] bg-dark-800 p-4 border border-dark-600 rounded break-words'>
        {children}
      </main>
    </div>
  )

}