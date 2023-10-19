'use client'

// next
import { useRouter } from 'next/navigation'

// packages
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solid from '@fortawesome/free-solid-svg-icons'

export default function DeleteAccount({ session }: { session: string | undefined }) {

    let router = useRouter()

    function handleClick() {
        fetch('/api/login', { method: 'DELETE', cache: 'no-cache', headers: { 'session': `${session}` } }).then((res) => {
            if(res.ok) router.push('/')
            else console.log(res)
        })
    }

    return (
        <button className='bg-white text-black p-2 font-semibold text-sm text-[0.75rem] hover:text-white hover:bg-red-500 flex gap-2 items-center group sm:text-base duration-300 active:scale-95' onClick={handleClick}>
            <FontAwesomeIcon icon={solid.faWarning} className='text-black group-hover:text-white w-5 h-5'></FontAwesomeIcon>Delete User Data
        </button>
    )

}