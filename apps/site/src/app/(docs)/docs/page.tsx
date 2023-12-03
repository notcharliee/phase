import Link from "next/link"
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Docs - Phase",
  description: "Welcome to the Phase documentation!"
}

export default () => {
  return (
    <div className="flex flex-col gap-16 text-lg font-medium text-light-300">
      <section className="flex flex-col gap-8">
        <h1 className="text-4xl font-bold">
          <span className="text-light-800">phase</span>
          <span className="text-phase">docs</span>
        </h1>
        <p>Welcome to the Phase documentation!</p>
      </section>
      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-light-800" id="what-is-phase">
          What is Phase?
        </h2>
        <p>
          Phase is a free to use, open source Discord bot built by{" "}
          <Link
            href="https://github.com/notcharliee"
            className="text-phase hover:underline"
          >
            @notcharliee
          </Link>{" "}
          (hello there 👋). It aims to be the all-in-one solution for as many
          servers as possible, with a large variety of different modules and
          commands.
        </p>
        <p>
          Under the hood, the bot is built with{" "}
          <Link
            href="https://discordjs.dev"
            className="text-phase hover:underline"
          >
            discord.js
          </Link>
          , a powerful Node.js module that allows you to interact with the
          Discord API. The site you are using to read this is primarily built
          with{" "}
          <Link
            href="https://nextjs.org"
            className="text-phase hover:underline"
          >
            next.js
          </Link>
          , a Rust-based JavaScript tool powered by React that allows you to
          build full-stack web applications, like this one.
        </p>
        <p>
          Whether you're seeking to enhance a small server shared with friends
          or overseeing a bustling community, Phase is your solution for
          effectively managing, moderating, and (hopefully) improving your
          Discord experience.
        </p>
      </section>
      <section className="flex flex-col gap-8">
        <h2
          className="text-2xl font-bold text-light-800"
          id="why-should-i-use-phase"
        >
          Why should I use Phase?
        </h2>
        <p>
          While popular bots like MEE6 or Dyno have their strengths, they lack
          transparency and lock their best features behind ridiculously priced
          paywalls. In contrast, Phase is...
        </p>
        <ul className="children:mb-2 grid gap-8 lg:grid-cols-3">
          <li>
            <span className='font-bold text-light-800'>1. Fully open source</span>
            <p>You get to see all the wonderful spaghetti code that goes into making everything work. You can even <Link href="https://github.com/notcharliee/phase" className="text-phase hover:underline">contribute</Link> as well!</p>
          </li>
          <li>
            <span className='font-bold text-light-800'>2. Completely free to use</span>
            <p>While <Link href="https://www.buymeacoffee.com/notcharliee" className="text-phase hover:underline">donations</Link> are appreciated to support the developer both financially and emotionally, they're entirely optional.</p>
          </li>
          <li>
            <span className='font-bold text-light-800'>3. And we listen to feedback</span>
            <p>If you have something to say, <Link href="/redirect/discord" className="text-phase hover:underline">let us know!</Link> Feature requests, bug reports, and all kinds of feedback are greatly appreciated.</p>
          </li>
        </ul>
        <p>
          In other words, you get a fancy experience and all the things your server needs, without
          the stress, and tears, and existential questioning that comes with
          actually coding your own server-tailored bot, whilst also not having to spend a penny!
        </p>
      </section>
      <section className="flex flex-wrap gap-6">
        <Link href={"/docs/modules"} className='p-4 border rounded border-phase hover:border-light-800 duration-150 shadow bg-dark-900 max-w-xs'>
          <span className='font-bold text-light-800'>Modules</span>
          <p className='text-sm mt-1.5'>Learn about Modules, how they work, and how to enable them in your servers.</p>
        </Link>
        <Link href={"/docs/commands"} className='p-4 border rounded border-phase hover:border-light-800 duration-150 shadow bg-dark-900 max-w-xs'>
          <span className='font-bold text-light-800'>Slash Commands</span>
          <p className='text-sm mt-1.5'>Check out all the Slash Commands that Phase comes with by default.</p>
        </Link>
        <Link href={"/docs/api"} className='p-4 border rounded border-phase hover:border-light-800 duration-150 shadow bg-dark-900 max-w-xs'>
          <span className='font-bold text-light-800'>Developer API</span>
          <p className='text-sm mt-1.5'>Read our Developer API docs for an inside look into how Phase works.</p>
        </Link>
      </section>
    </div>
  )
}
