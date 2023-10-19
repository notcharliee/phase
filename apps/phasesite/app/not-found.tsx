// next
import Link from 'next/link'


export default function notFound() {
    return (
        <div className='flex flex-col gap-8 items-center justify-center'>
            <h1 className='font-lilita uppercase max-w-[450px] text-left text-5xl select-none self-center gradient-text sm:text-center sm:text-6xl'>Error 404</h1>
            <p className='font-semibold max-w-[777px] text-center text-lg sm:text-xl'>Nothing to see here. Go away.<br></br>Pretty Please?</p>
            <Link href='/' className='m-8 w-64 h-12 active:scale-95 duration-300'>
                <span className='gradient-border-hover rounded-lg w-full h-full flex justify-center items-center font-semibold'>Go Back</span>
            </Link>
        </div>
    )
}