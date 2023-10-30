import Link from 'next/link'
import Image from 'next/image'


// Exporting page metadata

export const metadata = {
  title: 'Page Not Found - Phase',
}


// Exporting page tsx

export default () => {

  return (
      <body className='font-poppins bg-dark-900 motion-safe:bg-main-gif motion-reduce:bg-main-static text-light-900 min-h-dvh flex flex-col'>
        <main className='w-full max-w-6xl m-auto h-full flex flex-1 flex-col-reverse lg:flex-row items-center justify-between gap-8 p-8 pt-32 pb-32'>
          <div className='flex flex-col gap-6 max-w-[600px]'>
            <h1 className='font-cubano select-none text-4xl sm:text-5xl text-left'>Page not found</h1>
            <p className='font-semibold'>You look lost, but don't worry, we've got your back. The page you're searching for seems to have disappeared, but it might be back soon. In the meantime, why not explore some of our other pages?</p>
            <ul>
              <li><Link href='/' className='text-blue-500 font-semibold'>Home</Link></li>
              <li><Link href='/dashboard' className='text-blue-500 font-semibold'>Dashboard</Link></li>
              <li><Link href='/redirect/discord' className='text-blue-500 font-semibold'>Support</Link></li>
            </ul>
          </div>
          <Image src='/smpte-tv.png' alt='404' width={348.99} height={240} className='mb-8 lg:mb-0'></Image>
        </main>
        <footer className='w-full bg-dark-800 phase-gradient-border border-t-2 border-0'>
          <div className='w-full max-w-6xl text-sm flex flex-wrap justify-between gap-8 p-8 m-auto'>
            <ul className='flex flex-col justify-between'>
              <Link href='https://nextjs.org' className='text-blue-500 font-semibold'>
                <Image
                  src='https://raw.githubusercontent.com/notcharliee/phase/main/.github/assets/built-with-nextjs.png'
                  alt='Built with Next.JS'
                  width={192.72}
                  height={40}
                ></Image>
              </Link>
              <Link href='https://discordjs.dev' className='text-blue-500 font-semibold'>
                <Image
                  src='https://raw.githubusercontent.com/notcharliee/phase/main/.github/assets/built-with-discordjs.png'
                  alt='Built with Next.JS'
                  width={192.72}
                  height={40}
                ></Image>
              </Link>
            </ul>
            <ul className='inline-block'>
              <h5 className='font-cubano leading-none text-lg mb-2'>Pages</h5>
              <li><Link href='/' className='text-blue-500 font-semibold'>Home</Link></li>
              <li><Link href='/dashboard' className='text-blue-500 font-semibold'>Dashboard</Link></li>
              <li><Link href='/docs' className='text-blue-500 font-semibold'>Docs</Link></li>
            </ul>
            <ul className='inline-block'>
              <h5 className='font-cubano leading-none text-lg mb-2'>Resources</h5>
              <li><Link href='/redirect/github' className='text-blue-500 font-semibold'>GitHub</Link></li>
              <li><Link href='/redirect/discord' className='text-blue-500 font-semibold'>Support</Link></li>
              <li><Link href='/blog' className='text-blue-500 font-semibold'>Blog</Link></li>
            </ul>
            <ul className='inline-block'>
              <h5 className='font-cubano leading-none text-lg mb-2'>Policies</h5>
              <li><Link href='/terms' className='text-blue-500 font-semibold'>Terms</Link></li>
              <li><Link href='/privacy' className='text-blue-500 font-semibold'>Privacy</Link></li>
              <li><Link href='/guidelines' className='text-blue-500 font-semibold'>Guidelines</Link></li>
            </ul>
          </div>
        </footer>
      </body>
  )

}