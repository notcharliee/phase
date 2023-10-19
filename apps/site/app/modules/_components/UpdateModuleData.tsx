'use client'

// packages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solid from '@fortawesome/free-solid-svg-icons'


export default function UpdateModuleData({ deleteData }: { deleteData: (formData: FormData) => Promise<void> }): JSX.Element {
    return (
        <div className='flex gap-2'>
            <button className='bg-white text-black p-2 font-semibold text-sm text-[0.75rem] gradient-bg-hover flex gap-2 items-center group scale-100 sm:text-base active:scale-95 hover:text-white' type='submit'>
                <FontAwesomeIcon
                    icon={solid.faSave}
                    className='text-black group-hover:text-white w-5 h-5'
                ></FontAwesomeIcon>
                Save Changes
            </button>
            <button className='bg-white text-black p-2 font-semibold text-sm text-[0.75rem] gradient-bg-hover flex gap-2 items-center group scale-100 sm:text-base active:scale-95 hover:text-white' formAction={deleteData}>
                <FontAwesomeIcon
                    icon={solid.faRefresh}
                    className='text-black group-hover:text-white w-5 h-5'
                ></FontAwesomeIcon>
                Reset Changes
            </button>
        </div>
    )
}