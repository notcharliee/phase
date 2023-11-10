import Link from 'next/link'
import Image from 'next/image'

import Footer from '@/components/Footer'
import Header from '@/components/Header'


// Exporting page metadata

export const metadata = {
  title: 'Page Not Found - Phase',
}


// Exporting page tsx

export default () => {

  return (
    <div className='font-poppins bg-dark-900 bg-main text-light-900 min-h-dvh flex flex-col'>
      <Header></Header>
      <main className='w-full max-w-6xl m-auto h-full flex flex-1 flex-col-reverse lg:flex-row items-center justify-between gap-8 p-8 pt-32 pb-32'>
        <div className='flex flex-col gap-6 max-w-[600px]'>
          <h1 className='font-black select-none text-4xl sm:text-5xl text-left'>
            Page not found
          </h1>
          <p className='font-semibold'>
            You look lost, but don't worry, we've got your back. The page you're searching for seems to have disappeared, but it might be back soon. In the meantime, why not explore some of our other pages?
          </p>
          <ul>
            <li><Link href='/' className='text-blue-500 font-semibold'>Home</Link></li>
            <li><Link href='/dashboard' className='text-blue-500 font-semibold'>Dashboard</Link></li>
            <li><Link href='/redirect/discord' className='text-blue-500 font-semibold'>Support</Link></li>
          </ul>
        </div>
        <Image src='/smpte-tv.png' alt='404' width={348.99} height={240} className='mb-8 lg:mb-0'></Image>
      </main>
      <Footer></Footer>
    </div>
  )

}