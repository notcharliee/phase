'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solid from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import React from 'react'


export default function HeaderDropdown() {
    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        let menu = document.getElementById('navbar-menu')
        if(!menu) return

        menu.classList.toggle('invisible')

        if(!menu.classList.contains('invisible')) {
            menu.style.opacity = '1'
        } else {
            menu.style.opacity = '0'
        }
    }

    return (
        <button className='flex items-center sm:hidden group' onClick={handleClick}>
            <span className='relative flex justify-end'>
                <FontAwesomeIcon icon={solid.faEllipsisVertical} className='text-white w-5 h-5'></FontAwesomeIcon>
                <div className='absolute top-[125%] right-[-52.5%] invisible opacity-0 duration-300 flex flex-col z-50' id='navbar-menu'>
                    <div className='-mb-[2px] overflow-hidden flex items-end justify-end'>
                        <div className='mr-4 h-4 w-4 rounded origin-bottom-left rotate-45 transform border-2 border-[#DB00FF] bg-neutral-950'></div>
                    </div>
                    <div className='bg-black rounded gradient-border whitespace-nowrap'>
                        <span className='flex flex-col gap-2 p-2'>
                            <Link href='/commands' className='flex gap-2 items-center'>
                                <FontAwesomeIcon icon={solid.faLayerGroup} className='text-white w-4 h-4'></FontAwesomeIcon>
                                Commands
                            </Link>
                            <Link href='/modules' className='flex gap-2 items-center'>
                                <FontAwesomeIcon icon={solid.faCog} className='text-white w-4 h-4'></FontAwesomeIcon>
                                Modules
                            </Link>
                        </span>
                    </div>
                </div>
            </span>
        </button>
    )
}