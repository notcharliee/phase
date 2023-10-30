import Link from 'next/link'
import Image from 'next/image'


// Exporting route group layout

export default ({ children }: { children: React.ReactNode }) => {

  return (
    <body className='font-poppins bg-neutral-900 motion-safe:bg-main-gif motion-reduce:bg-main-static text-white min-h-dvh flex flex-col'>
      {children}
      <footer className='w-full bg-neutral-900 phase-gradient-border border-t-2 border-0'>
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
            <li><Link href='/privacy' className='text-blue-500 font-semibold'>Guidelines</Link></li>
          </ul>
        </div>
      </footer>
    </body>
  )

}