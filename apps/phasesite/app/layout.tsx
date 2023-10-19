// styles
import './globals.css'

// next
import type { Metadata } from 'next'
import { Poppins, Lilita_One } from 'next/font/google'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'

// utils
import { HeaderDropdown } from '@/utils/components'

// packages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solid from '@fortawesome/free-solid-svg-icons'


const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins' })
const lilita = Lilita_One({ subsets: ['latin'], weight: ['400'], variable: '--font-lilita' })

export const metadata: Metadata = {
    title: 'Phase | Discord Bot',
    description: 'Phase provides a comprehensive set of tools that enable effortless management, moderation, and optimization of your Discord servers.',
    icons: '/favicon.png',
    authors: [{ name: 'charliee', url: 'https://github.com/notcharliee' }],
    creator: 'Phase Team',
    keywords: ['discord', 'bot', 'phase', 'phase bot', 'notcharliee', 'phase', 'next.js', 'discord.js', 'mongodb'],
    openGraph: {
        type: 'website',
        url: 'https://phasebot.xyz',
        title: 'Phase | Discord Bot',
        description: 'Phase provides a comprehensive set of tools that enable effortless management, moderation, and optimization of your Discord servers.',
        siteName: 'Phase',
    },
    metadataBase: process.env.NODE_ENV == 'development' ? new URL('http://localhost:3000') : new URL('https://phasebot.xyz')
}

export default function rootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' className={`${poppins.variable} ${lilita.variable}`}>
            <body className='font-poppins min-h-screen bg-neutral-950 flex flex-col items-center justify-between'>
                <div id='cursor-blob' className='bg-white h-3 w-3 fixed left-0 top-0 rounded-full opacity-0 z-50 duration-300 pointer-events-none scale-0'></div>
                <div id='bg-grid' className='fixed -z-50 w-full h-full' style={{ backgroundImage: 'radial-gradient(circle, rgb(25, 25, 25) 15%, transparent 15%)', backgroundSize: '20px 20px' }}></div>
                <header className='w-full max-w-[1536px] p-8 flex justify-between items-center'>
                    <Link href='/' className='flex items-center h-8'><Image src='/banner.svg' alt='Phase Banner' priority height={0} width={0} style={{ width: 'auto', height: 'auto' }}/></Link>
                    <div className='flex flex-wrap justify-center items-center gap-2 font-semibold text-sm text-[0.75rem] sm:gap-4 sm:text-base text-neutral-400'>
                        <HeaderDropdown></HeaderDropdown>
                        <Link href='/modules' className='gradient-text-hover hidden sm:block'>Modules</Link>
                        <Link href='/commands' className='gradient-text-hover hidden sm:block'>Commands</Link>
                        {cookies().get('session') ? 
                            <Link href='/account' className='bg-white text-black p-2 hover:text-white gradient-bg-hover flex gap-2 items-center group'>
                                <FontAwesomeIcon icon={solid.faCircleUser} className='text-black group-hover:text-white w-5 h-5'></FontAwesomeIcon>Account
                            </Link> :
                            <Link href='/redirect/login' className='bg-white text-black p-2 hover:text-white gradient-bg-hover'>Login</Link>
                        }
                    </div>
                </header>
                <main className='w-full max-w-[1536px] p-8 flex flex-col justify-center gap-32 min-h-[calc(100vh-6rem)] z-0'>
                    {children}
                </main>
                <footer className='w-full max-w-[1536px] p-8 flex flex-col items-center gap-2'>
                    <div className='rounded w-32 h-1 bg-neutral-400'></div>
                    <span className='font-semibold text-sm sm:text-base mt-12'>Find an issue with this page? <Link href='https://github.com/notcharliee/phasesite' target='_blank' className='gradient-text'>Fix it on GitHub</Link></span>
                    <span className='font-semibold text-sm sm:text-base'>Need help? <Link href='/redirect/discord' target='_blank' className='gradient-text'>Join the Discord</Link></span>
                    <span className='font-lilita text-xl uppercase mt-4'>Helpful Links</span>
                    <div className='flex flex-wrap justify-center gap-2 font-semibold text-sm text-[0.75rem] sm:text-base text-neutral-400'>
                        <Link href='/modules' className='gradient-text-hover'>Modules</Link>·
                        <Link href='/commands' className='gradient-text-hover'>Commands</Link>·
                        <Link href='/redirect/login' className='gradient-text-hover'>Login</Link>·
                        <Link href='/privacy' className='gradient-text-hover'>Privacy</Link>·
                        <Link href='/terms' className='gradient-text-hover'>Terms</Link>
                    </div>
                    <span className='font-semibold text-sm text-[0.75rem] gradient-text mt-4'>Copyright © 2023 Phase</span>
                </footer>
                <script src='/scripts/cursorPointer.js'></script>
                <script src='/scripts/movingBackground.js'></script>
                <script src='/scripts/scrollToLink.js'></script>
            </body>
        </html>
    )
}