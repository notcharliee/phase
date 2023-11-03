import 'app/globals.css'

import { GeistSans } from 'geist/font'

import type { Metadata, Viewport } from 'next'


// Exporting global metadata

export const metadata: Metadata = {
  title: 'Phase',
  description: 'Phase is a free and open source all-in-one Discord bot. Our aim is to provide a comprehensive set of tools that enable effortless management, moderation, and optimization of your servers.',
  icons: process.env.BASE_URL + '/phase.png',
  authors: { name: '@notcharliee', url: 'https://github.com/notcharliee' },
  keywords: [ 'discord', 'bot', 'phase', 'phasebot', 'levels', 'free', 'open source', 'notcharliee' ],
  metadataBase: process.env.BASE_URL ? new URL(process.env.BASE_URL) : null,
  openGraph: {
    type: 'website',
    url: process.env.BASE_URL,
    title: 'Phase',
    description: 'Phase is a free and open source all-in-one Discord bot. Our aim is to provide a comprehensive set of tools that enable effortless management, moderation, and optimization of your servers.',
    images: process.env.BASE_URL + '/og_image.png'
  },
  twitter: {
    card: 'summary',
    creator: '@notcharliee',
    description: 'Phase is a free and open source all-in-one Discord bot. Our aim is to provide a comprehensive set of tools that enable effortless management, moderation, and optimization of your servers.',
    site: process.env.BASE_URL,
    images: process.env.BASE_URL + '/og_image.png',
  },
}


// Exporting global viewport

export const viewort: Viewport = {
  colorScheme: 'dark',
  themeColor: '#A400FF',
}


// Exporting global layout

export default ({ children }: { children: React.ReactNode }) => {

  return <html lang='en' className={GeistSans.variable + ' font-geist-sans tracking-tight'}>
    <body>
      <div id='modals'></div>
      {children}
    </body>
  </html>
  
}