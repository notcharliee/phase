import Link from 'next/link'


// Exporting page metadata

export const metadata = {
  title: 'Documentation - Phase'
}


// Exporting page tsx

export default () => {

  return (
    <div className='flex flex-col gap-8 font-medium text-lg text-light-600'>
      <h1 className='font-bold text-4xl'>
        <span className='text-light-800'>phase</span>
        <span className="text-phase">docs</span>
      </h1>
      <p>
        Welcome to the Phase documentation page!
      </p>
      <section className='flex flex-col gap-8'>
        <h2 className='font-bold text-2xl text-light-800' id='what-is-phase'>What is Phase?</h2>
        <p>
          Phase is a free to use, open source Discord bot built by <Link href="https://github.com/notcharliee" className='text-phase hover:underline'>@notcharliee</Link> (hello there 👋). It aims to be the all-in-one solution for as many servers as possible, with a large variety of different modules and commands.
        </p>
        <p>
          Under the hood, the bot is built with <Link href="https://discordjs.dev" className='text-phase hover:underline'>discord.js</Link>, a powerful Node.js module that allows you to interact with the Discord API. The site you are using to read this is primarily built with <Link href="https://nextjs.org" className='text-phase hover:underline'>next.js</Link>, a Rust-based JavaScript tool powered by React that allows you to build full-stack web applications, like this one.
        </p>
        <p>
          Whether you're seeking to enhance a small server shared with friends or overseeing a bustling community, Phase is your solution for effectively managing, moderating, and (hopefully) improving your Discord experience.
        </p>
      </section>
      <section className='flex flex-col gap-8'>
        <h2 className='font-bold text-2xl text-light-800' id='what-is-phase'>Why is Phase?</h2>
        <p>
          You're probably thinking "okay cool but my server's already set up with a load of other bots why would I bother switching that's so much effort". And... yes... but allow me to try and convince you otherwise! While more mainstream bots like MEE6 or Dyno are great at what they do, they aren't perfect.
        </p>
        <span className='font-semibold text-light-800 text-lg mb-[-1rem]'>1. You can see behind the curtain!</span>
        <p>
          A lot of larger bots are mostly, if not completely, closed source, which isn't necessarily bad of course, it's just not very transparent. With Phase on the otherhand, you can see all the spaghetti code that's used behind the scenes - you can even contribute to the codebase as well if there's a feature you're *absolutely* dying for, though you probably wouldn't even have to because...
        </p>
        <span className='font-semibold text-light-800 text-lg mb-[-1rem]'>2. We actually listen. (🤯)</span>
        <p>
          I know, crazy. If you have a command or module that you need for your server, and it isn't against Discord ToS, we'll get it in the bot for you. All you gotta do is ask, and we'll code it in. It's like having your own personal bot without all the stress, tears, and the questioning of life choices that goes into building one.
        </p>
        <span className='font-semibold text-light-800 text-lg mb-[-1rem]'>3. No need for mum's credit card.</span>
        <p>
          It's free. Of course you can <Link href='/redirect/donate' className='text-phase hover:underline'>donate</Link> (pls) if you wish to support me, the dev, both financially and emotionally, but you don't <i>have</i> to.
        </p>
        <span className='font-semibold text-light-800 text-lg mb-[-1rem]'>4. It's cool. (promise)</span>
        <p>
          Obviously you don't have to use it, nobody's forcing you, it's just a cool thing I've been working on for a while and if you feel like your server could get some use out of it, <Link href='/redirect/invite' className='text-phase hover:underline'>invite it</Link>!
        </p>
      </section>
    </div>
  )

}