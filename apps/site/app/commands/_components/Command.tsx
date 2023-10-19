'use client'

// packages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solid from '@fortawesome/free-solid-svg-icons'


export default function Command({ name, description, type, permission, options }: {
    name: string,
    description: string,
    type: 'Fun' | 'Games' | 'Info' | 'Moderation' | 'Module' | 'Misc',
    permission?: 'Low' | 'Medium' | 'High' | 'Owner',
    options?: string[] 
}) {

    let permissionElement: JSX.Element = <span className='bg-neutral-800 rounded text-green-400 border border-green-400 p-1 text-[0.65rem] leading-none font-bold'>None</span>

    if(permission) {
        if(permission == 'Low') permissionElement = <span className='bg-neutral-800 rounded text-yellow-400 border border-yellow-400 p-1 text-[0.65rem] leading-none font-bold'>{permission}</span>
        if(permission == 'Medium') permissionElement = <span className='bg-neutral-800 rounded text-orange-400 border border-orange-400 p-1 text-[0.65rem] leading-none font-bold'>{permission}</span>
        if(permission == 'High') permissionElement = <span className='bg-neutral-800 rounded text-red-400 border border-red-400 p-1 text-[0.65rem] leading-none font-bold'>{permission}</span>
        if(permission == 'Owner') permissionElement = <span className='bg-neutral-800 rounded text-[#5865F2] border border-[#5865F2] p-1 text-[0.65rem] leading-none font-bold'>{permission}</span>
    }

    return (
        <div className={`${type} command`} id={name}>
            <div className='w-72 h-48 p-4 flex flex-col justify-between rounded-md bg-neutral-900'>
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
                        <span className='flex gap-1 items-center font-semibold text-sm text-white'><FontAwesomeIcon icon={solid.faGear} width={14} height={14}></FontAwesomeIcon>Options:</span>
                        <div className='flex gap-1'>{options ? 
                            options.map((option, i) => { return <span className='bg-neutral-800 rounded text-neutral-400 border border-neutral-400 p-1 text-[0.65rem] leading-none font-bold' key={i}>{option}</span> }) :
                            <span className='bg-neutral-800 rounded text-neutral-400 border border-neutral-400 p-1 text-[0.65rem] leading-none font-bold' key={1}>None</span>
                        }</div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <span className='flex gap-1 items-center font-semibold text-sm text-white'><FontAwesomeIcon icon={solid.faUser} width={14} height={14}></FontAwesomeIcon>Permissions:</span>
                        {permissionElement}
                    </div>
                </div>
            </div>
        </div>
    )

}