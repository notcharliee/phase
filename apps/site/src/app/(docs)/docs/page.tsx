import Link from "next/link"
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Docs - Phase",
  description: "Welcome to the Phase documentation!"
}

export default () => {
  return (
    <div className="flex flex-col gap-16 text-lg font-medium text-light-400">
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
          You might be thinking "My server is already set up with a load of
          other bots, why go through the hassle of switching?". And... yes, but
          while popular bots like MEE6 or Dyno have their strengths, they lack
          transparency. In contrast, Phase is fully open source, so you can see
          all the wonderful spaghetti code that goes into making it - you can
          even contribute if you want to!
        </p>
        <p>
          But the best part is, we listen to our users. If you need a specific
          command or module for your server, just ask and we'll make it happen.
          You get a fancy bot experience with all the things your server needs
          without the stress, tears, and existential questioning that comes with
          actually building one. Plus, Phase is also completely free to use.
          While donations are appreciated to support the developer both
          financially and emotionally, they're entirely optional.
        </p>
      </section>
      <section className="flex flex-wrap gap-6">
        <Link href={"/docs/modules"} className='p-4 border rounded border-phase hover:border-light-800 duration-150 shadow bg-dark-900 max-w-xs'>
          <span className='font-bold text-light-800'>Modules</span>
          <p className='text-sm mt-1.5'>Learn about modules, how they work, and how to enable them.</p>
        </Link>
        <Link href={"/docs/commands"} className='p-4 border rounded border-phase hover:border-light-800 duration-150 shadow bg-dark-900 max-w-xs'>
          <span className='font-bold text-light-800'>Commands</span>
          <p className='text-sm mt-1.5'>Check out every slash command Phase comes with by default.</p>
        </Link>
      </section>
    </div>
  )
}
