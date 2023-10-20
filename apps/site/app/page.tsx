// next
import Image from 'next/image'
import Link from 'next/link'


export const metadata = { title: 'Phase | Discord Bot' }
export const dynamic = 'force-dynamic'

export default async function page() {
    let statsResponse = await fetch(process.env.BASE_URL + '/api/stats', { method: 'GET', next: { revalidate: 3600 } })
    let statsJSON = await statsResponse.json()

    return (
        <>
            <div className='flex flex-col gap-8 items-center justify-center min-h-[calc(100vh-12rem)]'>
                <h1 className='font-lilita uppercase max-w-[450px] text-left text-5xl select-none self-start sm:text-center sm:text-6xl sm:self-center'>The <span className='gradient-text'>all in one</span> Discord Bot</h1>
                <p className='font-semibold max-w-[777px] text-left text-lg sm:text-center sm:text-xl'>Phase provides a comprehensive set of tools that enable effortless management, moderation, and optimization of your Discord servers.</p>
                <Link href='/?scrollTo=tools-96;' className='m-8 w-64 h-12 active:scale-95 duration-300'>
                    <span className='gradient-border-hover rounded-lg w-full h-full flex justify-center items-center font-semibold'>Oo, tell me more!</span>
                </Link>
            </div>
            <div className='flex flex-col gap-12 min-h-[calc(100vh-12rem)] justify-center items-center lg:flex-row' id='#tools'>
                <img src='/home/discordchat.svg' className='max-w-[650px] w-full'></img>
                <div className='flex flex-col gap-8 items-center justify-start'>
                    <h2 className='font-lilita uppercase max-w-[450px] text-left text-3xl select-none self-start sm:text-4xl'>All the tools you need,<br></br>All in one place</h2>
                    <p className='font-semibold max-w-[777px] text-left text-lg sm:text-xl'>Phase is packed with countless modules, commands and functions to make enhancing your server as simple and easy as possible.</p>
                    <div className='flex flex-wrap gap-4 m-8 ml-0 mr-0 justify-center self-center lg:self-start'>
                        <Link href='/commands' className='w-64 h-12 active:scale-95 duration-300'>
                            <span className='gradient-border-hover rounded-lg w-full h-full flex justify-center items-center font-semibold'>Command List</span>
                        </Link>
                        <Link href='/modules' className='w-64 h-12 active:scale-95 duration-300'>
                            <span className='gradient-border-hover rounded-lg w-full h-full flex justify-center items-center font-semibold'>Module List</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-8 items-center justify-center min-h-[calc(100vh-12rem)]' id='#poweredby'>
                <h2 className='font-lilita uppercase max-w-[450px] text-left text-3xl select-none self-start sm:text-center sm:text-4xl sm:self-center'>Built on a foundation of fast & reliable tooling</h2>
                <p className='font-semibold max-w-[777px] text-left text-lg sm:text-center sm:text-xl'>Phase is powered by fast, efficient, and flexible tools designed to work seamlessly together to provide the perfect end-user experience.</p>
                <div className='flex flex-wrap justify-center gap-8 m-8'>
                    <Link href='https://discordjs.dev' target='_blank' className='w-64 h-64 gradient-border rounded-lg hover:scale-105 active:scale-100 duration-300'>
                        <div className='flex flex-col p-4 gap-2'>
                            <span className='font-lilita uppercase flex gap-2 items-center text-lg sm:text-xl'>
                                <Image src='/home/discordjs.webp' alt='Discord.JS Logo' width={48} height={48} className='rounded-full'></Image>Discord.JS
                            </span>
                            <p className='text-sm font-medium text-neutral-400'>Discord.js is a powerful Node.js module that allows you to interact with the Discord API with ease. It takes an object-oriented approach, making code significantly tidier and easier to work with.</p>
                        </div>
                    </Link>
                    <Link href='https://nextjs.org' target='_blank' className='w-64 h-64 gradient-border rounded-lg hover:scale-105 active:scale-100 duration-300'>
                        <div className='flex flex-col p-4 gap-2'>
                            <span className='font-lilita uppercase flex gap-2 items-center text-lg sm:text-xl'>
                                <Image src='/home/nextjs.webp' alt='Next.JS Logo' width={48} height={48} className='rounded-full'></Image>Next.JS
                            </span>
                            <p className='text-sm font-medium text-neutral-400'>Next.js enables you to create full-stack Web applications by extending the latest React features, and integrating powerful Rust-based JavaScript tooling for the fastest builds.</p>
                        </div>
                    </Link>
                    <Link href='https://mongodb.com' target='_blank' className='w-64 h-64 gradient-border rounded-lg hover:scale-105 active:scale-100 duration-300'>
                        <div className='flex flex-col p-4 gap-2'>
                            <span className='font-lilita uppercase flex gap-2 items-center text-lg sm:text-xl'>
                                <Image src='/home/mongodb.webp' alt='Next.JS Logo' width={48} height={48} className='rounded-full'></Image>MongoDB
                            </span>
                            <p className='text-sm font-medium text-neutral-400'>MongoDB is a popular NoSQL database that uses a flexible, document-oriented data model to store and manage data. It is designed to scale easily and handle large volumes of data in a high-performance manner.</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className='flex flex-col gap-8 items-center justify-center min-h-[calc(100vh-12rem)]' id='#about'>
                <h2 className='font-lilita uppercase max-w-[450px] text-left text-3xl select-none self-start sm:text-center sm:text-4xl sm:self-center'>Ready to start your journey?</h2>
                <p className='font-semibold max-w-[777px] text-left text-lg sm:text-center sm:text-xl'>Phase is used by <span className='font-lilita uppercase gradient-text'>{statsJSON.userCount} users</span> worldwide. As we expand further, join us on this adventure by inviting Phase to your server today!</p>
                <div className='flex flex-wrap gap-4 m-8 items-center'>
                    <Link href='/redirect/invite' className='w-64 h-12 active:scale-95 duration-300'>
                        <span className='gradient-border-hover rounded-lg w-full h-full flex justify-center items-center font-semibold'>Invite the Bot</span>
                    </Link>
                    <span className='font-lilita uppercase text-xl hidden sm:block'>or</span>
                    <Link href='/redirect/discord' className='w-64 h-12 active:scale-95 duration-300'>
                        <span className='gradient-border-hover rounded-lg w-full h-full flex justify-center items-center font-semibold'>Try out on Discord</span>
                    </Link>
                </div>
            </div>
        </>
    )
}