'use client'

import { useState } from 'react'


export default function NumberInput({ defaultValue }: { defaultValue?: number }) {
    const [inputValue, setInputValue] = useState<string | number | undefined>(defaultValue)

    return <input
        onChange={(e) => { setInputValue(e.target.value.replace(/[^0-9]/g, '')) }}
        placeholder='# Level'
        value={inputValue}
        defaultValue={defaultValue}
        name='roleLevel'
        className='w-24 bg-neutral-800 p-2 rounded-md outline-none font-semibold text-white placeholder-neutral-400'
        type='number'
    ></input>
}