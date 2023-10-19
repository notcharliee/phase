'use client'

// next
import Link from 'next/link'

// packages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solid from '@fortawesome/free-solid-svg-icons'

import { module } from '../_constants/modules'


export default function page({ name, id, description, type, complexity, guild }: module) {

    let complexityElement: JSX.Element = <></>

    if(complexity) {
        if(complexity == 'Low') complexityElement = <span className='bg-neutral-800 rounded text-green-400 border border-green-400 p-1 text-[0.65rem] leading-none font-bold'>{complexity}</span>
        if(complexity == 'Medium') complexityElement = <span className='bg-neutral-800 rounded text-orange-400 border border-orange-400 p-1 text-[0.65rem] leading-none font-bold'>{complexity}</span>
        if(complexity == 'High') complexityElement = <span className='bg-neutral-800 rounded text-red-400 border border-red-400 p-1 text-[0.65rem] leading-none font-bold'>{complexity}</span>
    }

    return (
        <div className={`${type} module`} id={name}>
            <div className='w-72 h-[calc(18rem+56px)] flex flex-col bg-neutral-800 rounded-md'>
                <div className='w-full min-h-[7rem] bg-neutral-800 rounded-t-md' style={{ background: `url(${`/modules/${id}.svg`}) center center/cover no-repeat` }}></div>
                <div className='w-full h-full p-4 flex flex-col justify-between bg-neutral-900'>
                    <div>
                        <span className='font-lilita uppercase truncate text-base font-bold select-none sm:text-lg'>{name}</span>
                        <span className='flex gap-1 items-center font-semibold text-sm text-[0.75rem] text-neutral-400'>{description}</span>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <div className='flex gap-2 items-center'>
                            <span className='flex gap-1 items-center font-semibold text-sm text-white'><FontAwesomeIcon icon={solid.faTag} width={14} height={14}></FontAwesomeIcon>Type:</span>
                            <span className='font-bold text-sm text-neutral-400'>{type}</span>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <span className='flex gap-1 items-center font-semibold text-sm text-white'><FontAwesomeIcon icon={solid.faFire} width={14} height={14}></FontAwesomeIcon>Complexity:</span>
                            {complexityElement}
                        </div>
                    </div>
                </div>
                <div className='w-full min-h-[56px] pl-4 pr-4 flex flex-col justify-start bg-neutral-900 rounded-b-md'>
                    {guild ? <Link href={`/modules/${id}?guild=${guild}`} className='flex gap-1 items-center justify-center font-semibold text-base p-2 bg-neutral-800 rounded-md duration-300 scale-100 active:scale-95'>
                        Settings
                        <FontAwesomeIcon icon={solid.faSquareUpRight} width={18} height={18}></FontAwesomeIcon>
                    </Link> : <div className='flex gap-1 items-center justify-center font-semibold text-base p-2 bg-neutral-800 rounded-md brightness-75'>
                        Settings
                        <FontAwesomeIcon icon={solid.faSquareUpRight} width={18} height={18}></FontAwesomeIcon>
                    </div>}
                </div>
            </div>
        </div>
    )

}