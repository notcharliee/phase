'use client'

// packages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solid from '@fortawesome/free-solid-svg-icons'

// constants
import commandsArray from '../_constants/commands'


export default function SearchBar() {

    function search() {
        let commandElements = document.querySelectorAll('.command')
    
        let searchbar = document.querySelector<HTMLInputElement>('#searchbar')
        let query = searchbar?.value
    
        commandElements.forEach(element => element.classList.remove('hidden'))
    
        if (!query) return
    
        let commands: { name: string, description: string, type: string }[] = []
    
        for (let command of commandsArray) {
            let lowercaseQuery = query.toLowerCase()
            let lowercaseName = command.name.toLowerCase()
            let lowercaseType = command.type.toLowerCase()
    
            if (lowercaseName.includes(lowercaseQuery) || lowercaseType.includes(lowercaseQuery)) {
                commands.push(command)
            }
        }
    
        commandElements.forEach(element => {
            if (!commands.find(e => e.name === element.id)) {
                element.classList.add('hidden')
            }
        })
    }
    

    return (
        <div className='flex gap-2'>
            <input type='text' placeholder='Search' className='bg-neutral-800 text-white border border-neutral-600 p-2 font-semibold text-sm text-[0.75rem] sm:text-base placeholder-white outline-none' id='searchbar' onSubmit={search} onInput={search}></input>
            <button className='bg-neutral-800 text-white border border-neutral-600 p-2 leading-none' onClick={search}>
                <FontAwesomeIcon icon={solid.faSearch} className='w-5 h-5 sm:w-6 sm:h-6'></FontAwesomeIcon>
            </button>
        </div>
    )
}