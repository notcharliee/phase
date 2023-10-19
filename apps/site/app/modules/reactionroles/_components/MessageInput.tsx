'use client'

import { useState } from 'react'


export default function MessageInput({ defaultValue, guild, channels }: { defaultValue?: string, guild: string, channels: string[] }) {
    const [validValue, setValidValue] = useState<boolean>(!!defaultValue)

    return <input
        onChange={(e) => { setValidValue(isValidValue(e.target.value, guild, channels)) }}
        placeholder='Enter message link here...'
        defaultValue={defaultValue}
        name='message'
        className={'w-full bg-neutral-800 p-2 rounded-md outline-none font-semibold placeholder-neutral-400 ' + `${validValue ? 'text-green-400' : 'text-red-400'}`}
        maxLength={88}
        minLength={88}
        required={true}
        type='text'
        pattern={`^https:\/\/discord\.com\/channels\/${guild}\/(${channels.join('|')})\/.{19}$`}
    ></input>
}

function isValidValue(value: string, guild: string, channels: string[]): boolean {
    let regex = new RegExp(`^https:\/\/discord\.com\/channels\/${guild}\/(${channels.join('|')})\/.{19}$`)
    return regex.test(value)
}