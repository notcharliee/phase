import Link from 'next/link'

import Footer from 'components/Footer'
import Header from 'components/Header'

import Typewriter from 'components/Typewriter'


// Exporting page tsx

export default () => {
  return (
    <div className="min-h-dvh flex flex-col justify-between bg-dark-900 font-poppins text-light-900 motion-safe:bg-main-gif motion-reduce:bg-main-static">
      <Header></Header>
      <main className="m-auto flex w-full max-w-6xl flex-col items-center justify-center p-8 pb-32 pt-32">
        <h1 className="max-w-[475px] text-5xl font-black tracking-tighter sm:mr-0 text-center sm:text-6xl">
          <Typewriter typeString='The <span class="phase-gradient-text">all in one</span> Discord bot '></Typewriter>
        </h1>
        <p className="max-w-xl pt-8 text-lg sm:text-xl text-light-600 font-medium text-center">
          Phase is a free, open source, all-in-one Discord bot, built to make managing Discord servers easy for everyone.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-12">
          <Link
            href="/dashboard"
            className='bg-light-900 text-dark-900 text-lg font-extrabold px-6 py-2  phase-gradient-border-button border-l-light-900 border-t-light-900'
          >Get Started</Link>
          <Link
            href="/docs"
            className="text-lg font-semibold"
          >Learn More →</Link>
        </div>
      </main>
      <Footer></Footer>
    </div>
  )
}