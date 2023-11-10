import Link from 'next/link'
import Image from 'next/image'

import { cookies } from 'next/headers'

import { API } from '@discordjs/core/http-only'
import { REST } from '@discordjs/rest'

import Modal from '@/components/Modal'


// Exporting page metadata

export const metadata = {
  title: 'Dashboard - Phase'
}


// Exporting page tsx

export default async () => {

  const discordREST = new REST().setToken(process.env.DISCORD_TOKEN!)
  const discordAPI = new API(discordREST)

  const userId = cookies().get('auth_id')!
  const userCookie = cookies().get('auth_session')!
  
  const user = await discordAPI.users.get(userId.value)

  const discordUserBanner = user.banner ? discordREST.cdn.banner(user.id, user.banner) : '/discord.png'
  const discordUserAvatar = user.avatar ? discordREST.cdn.avatar(user.id, user.avatar) : '/discord.png'


  return (
    <div className='w-full max-w-[450px] bg-dark-700 rounded shadow border border-dark-600'>
      <div className='mb-[70px] relative'>
        <Image src={discordUserBanner} width={0} height={150} alt='' className='rounded-tl rounded-tr w-full min-h-[150px] max-h-[150px]'></Image>
        <Image src={discordUserAvatar} width={120} height={120} alt='' className='rounded-full border-8 border-dark-700 absolute left-4 top-[90px]'></Image>
      </div>
      <div className='bg-dark-800 flex flex-col p-4 m-4 rounded'>
        <span className='font-semibold text-lg'>{user.global_name}</span>
        <span className='font-semibold text-sm text-light-100'>{user.username}</span>
        <div className='flex flex-col mt-4 text-sm'>
          <span className='font-semibold'>User ID<span className='text-light-100 ml-2'>{user.id}</span></span>
          <span className='font-semibold'>
            User Token
            <Modal button={
              <span className='font-semibold text-blue-500 underline-offset-2 hover:underline ml-2 cursor-pointer select-none'>Click to view</span>
            }>
              <div className='max-w-[400px] bg-dark-700 text-light-100 font-medium p-5 rounded-lg shadow border border-dark-600'>
                <h3 className='font-bold text-light-900 text-xl'>User Token</h3>
                <p className='mt-2'>
                  This is your current user token.<br/><br/>
                  Each time you reauthenticate, even if using the same account, a new token will be generated.<br/><br/>
                  Tokens are used to authenticate your requests to our API & Dashboard. For API docs, <Link href='/docs/api' className='text-blue-500'>click here.</Link>
                </p>
                <h3 className='font-bold text-light-900 text-xl mt-6'>Warning</h3>
                <p className='mt-2 text-[#FF5656]'>
                  Never share this token with anyone, as it can be used to make changes to your servers/account.
                </p>
                <div className='w-full bg-dark-800 text-light-100 mt-6 font-medium p-3 pl-4 pr-4 rounded shadow border border-dark-800'>
                  {userCookie.value}
                </div>
              </div>
            </Modal>
          </span>
        </div>
      </div>
    </div>
  )

}