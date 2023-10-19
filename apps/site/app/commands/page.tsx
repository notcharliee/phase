// components
import Command from './_components/Command'
import SearchBar from './_components/SearchBar'

// constants
import commandsArray from './_constants/commands'


export const metadata = { title: 'Commands' }
export const dynamic = 'force-static'

export default async function page() {
    return (
        <div className='w-full max-w-[1536px] p-8 flex flex-col justify-start gap-32 min-h-[calc(100vh-6rem)] relative'>
            <div className='flex flex-col gap-8 items-center justify-center self-center max-w-4xl min-h-[calc(50vh-12rem)]'>
                <h2 className='font-lilita uppercase max-w-[450px] gradient-text text-5xl select-none text-center sm:text-6xl sm:self-center'>Commands</h2>
                <p className='font-semibold max-w-[777px] text-center text-lg sm:text-xl'>Explore our expansive list of commands and unlock the full potential of Phase's capabilities.</p>
                <SearchBar></SearchBar>
            </div>
            <div className='flex flex-wrap gap-8 justify-center'>
                {commandsArray.map((command, i) => { return <Command name={command.name} description={command.description} type={command.type} options={command.options} permission={command.permission} key={i}></Command> })}
            </div>
        </div>
    )
}