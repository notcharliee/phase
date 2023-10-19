

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solid from '@fortawesome/free-solid-svg-icons'



export const metadata = { title: 'Account' }

export default async function page() {

    return (
        <>
            <div className='flex flex-col gap-8 items-center justify-center self-center min-h-[calc(100vh-12rem)] max-w-4xl w-full'>
                <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>Your Account</h2>
                <div className='flex flex-col bg-neutral-900 rounded-md max-w-lg w-full'>
                    <div className='relative overflow-hidden rounded-md bg-neutral-800'>
                        <div className='w-full h-full flex flex-col relative'>
                            <div className='flex items-center justify-center w-full h-36'>
                                <div className='w-full h-full bg-neutral-800 scale-105 inset-0 opacity-80 blur-sm z-10 animate-pulse'></div>
                            </div>
                            <div className='flex flex-col items-start justify-center w-full h-1/2 z-20 p-4 bg-neutral-900'>
                                <div className='flex items-start justify-between w-full'>
                                    <span className='truncate text-base font-semibold select-none sm:text-lg'>Loading...</span>
                                    <span className='flex'>
                                        <span className='w-5 h-5 m-0.5 rounded bg-neutral-800 animate-pulse'></span>
                                        <span className='w-5 h-5 m-0.5 rounded bg-neutral-800 animate-pulse'></span>
                                        <span className='w-5 h-5 m-0.5 rounded bg-neutral-800 animate-pulse'></span>
                                    </span>
                                </div>
                                <span className='flex gap-1 items-center font-semibold text-sm text-[0.75rem] text-neutral-400'>Loading...</span>
                                <div className='mt-4 flex flex-col gap-2'>
                                    <div>
                                        <span className='flex gap-1 items-center w-full font-semibold text-sm text-white'>
                                            <FontAwesomeIcon icon={solid.faUser} width={14} height={14}></FontAwesomeIcon>
                                            User ID
                                        </span>
                                        <strong className='text-sm text-neutral-400'>Loading...</strong>
                                    </div>
                                    <div>
                                        <span className='flex gap-1 items-center w-full font-semibold text-sm text-white'>
                                            <FontAwesomeIcon icon={solid.faCookieBite} width={14} height={14}></FontAwesomeIcon>
                                            Session ID
                                        </span>
                                        <strong className='text-sm text-neutral-400'>Loading...</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-8 items-center justify-center self-center min-h-[calc(100vh-12rem)] max-w-4xl'>
                <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>Your Servers</h2>
                <div className='flex flex-wrap gap-8 justify-center m-8'>
                    <div className='relative overflow-hidden rounded-md bg-neutral-800'>
                        <div className='w-64 h-48 flex flex-col relative'>
                            <div className='flex items-center justify-center w-full h-1/2'>
                                <div className='w-full h-full bg-neutral-800 scale-105 inset-0 opacity-50 blur-sm z-10 animate-pulse'></div>
                            </div>
                            <div className='flex flex-col items-start justify-center w-full h-1/2 z-20 p-4 bg-neutral-900'>
                                <div className='flex items-start justify-start w-full'>
                                    <span className='truncate text-base font-semibold select-none sm:text-lg'>Loading...</span>
                                </div>
                                <div>
                                    <span className='flex gap-1 items-center font-semibold text-sm text-[0.75rem] text-neutral-400'>
                                        <FontAwesomeIcon icon={solid.faCircle} width={8} height={8} className='text-[#3ba55d]'></FontAwesomeIcon>
                                        0 Online
                                    </span>
                                    <span className='flex gap-1 items-center font-semibold text-sm text-[0.75rem] text-neutral-400'>
                                        <FontAwesomeIcon icon={solid.faCircle} width={8} height={8} className='text-[#747f8d]'></FontAwesomeIcon>
                                        0 Members
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='relative overflow-hidden rounded-md bg-neutral-800'>
                        <div className='w-64 h-48 flex flex-col relative'>
                            <div className='flex items-center justify-center w-full h-1/2'>
                                <div className='w-full h-full bg-neutral-800 scale-105 inset-0 opacity-50 blur-sm z-10 animate-pulse'></div>
                            </div>
                            <div className='flex flex-col items-start justify-center w-full h-1/2 z-20 p-4 bg-neutral-900'>
                                <div className='flex items-start justify-start w-full'>
                                    <span className='truncate text-base font-semibold select-none sm:text-lg'>Loading...</span>
                                </div>
                                <div>
                                    <span className='flex gap-1 items-center font-semibold text-sm text-[0.75rem] text-neutral-400'>
                                        <FontAwesomeIcon icon={solid.faCircle} width={8} height={8} className='text-[#3ba55d]'></FontAwesomeIcon>
                                        0 Online
                                    </span>
                                    <span className='flex gap-1 items-center font-semibold text-sm text-[0.75rem] text-neutral-400'>
                                        <FontAwesomeIcon icon={solid.faCircle} width={8} height={8} className='text-[#747f8d]'></FontAwesomeIcon>
                                        0 Members
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='relative overflow-hidden rounded-md bg-neutral-800'>
                        <div className='w-64 h-48 flex flex-col relative'>
                            <div className='flex items-center justify-center w-full h-1/2'>
                                <div className='w-full h-full bg-neutral-800 scale-105 inset-0 opacity-50 blur-sm z-10 animate-pulse'></div>
                            </div>
                            <div className='flex flex-col items-start justify-center w-full h-1/2 z-20 p-4 bg-neutral-900'>
                                <div className='flex items-start justify-start w-full'>
                                    <span className='truncate text-base font-semibold select-none sm:text-lg'>Loading...</span>
                                </div>
                                <div>
                                    <span className='flex gap-1 items-center font-semibold text-sm text-[0.75rem] text-neutral-400'>
                                        <FontAwesomeIcon icon={solid.faCircle} width={8} height={8} className='text-[#3ba55d]'></FontAwesomeIcon>
                                        0 Online
                                    </span>
                                    <span className='flex gap-1 items-center font-semibold text-sm text-[0.75rem] text-neutral-400'>
                                        <FontAwesomeIcon icon={solid.faCircle} width={8} height={8} className='text-[#747f8d]'></FontAwesomeIcon>
                                        0 Members
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-8 items-center justify-center self-center min-h-[calc(100vh-12rem)] max-w-4xl'>
                <h2 className='font-lilita uppercase max-w-[450px] text-3xl select-none text-center sm:text-4xl sm:self-center'>Danger Zone</h2>
                <p className='font-semibold max-w-[777px] text-center text-lg sm:text-xl'>In accordance with <span className='gradient-text'>GDPR</span>, you can use this button to log out and wipe your data from our servers.</p>
                <div className='bg-white text-black p-2 font-semibold text-sm text-[0.75rem] hover:text-white hover:bg-red-500 flex gap-2 items-center group sm:text-base'>
                    <FontAwesomeIcon icon={solid.faWarning} className='text-black group-hover:text-white w-5 h-5'></FontAwesomeIcon>Delete User Data
                </div>
            </div>
        </>
    )
}