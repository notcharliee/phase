'use client'

// packages
import { useState } from 'react'

export default function ElementList({ element, defaultValues, name, maxCount }: { element: JSX.Element, defaultValues?: JSX.Element[], name: string, maxCount: number }) {

    let [addDisabled, setAddDisabled] = useState<boolean>(false)
    let [remDisabled, setRemDisabled] = useState<boolean>(!defaultValues?.length)
    let [elementList, setElementList] = useState<JSX.Element[]>(defaultValues || [])

    function handleAdd() {
        if(elementList.length >= maxCount || addDisabled) return

        let newDropdown = [...elementList]
        newDropdown.push(element)

        setElementList(newDropdown)
        setRemDisabled(false)

        if(maxCount <= newDropdown.length) setAddDisabled(true)
    }

    function handleRemove() {
        if(!elementList.length || remDisabled) return

        let newDropdown = [...elementList]
        newDropdown.pop()

        setElementList(newDropdown)
        setAddDisabled(false)

        if(!newDropdown.length) setRemDisabled(true)
    }

    return (
        <>
            <div className='flex flex-col gap-2'>{elementList}</div>
            <div className='flex gap-2'>
                <button
                    className={`w-full bg-neutral-800 rounded-md font-semibold p-2 ${addDisabled ? 'brightness-75' : ''}`}
                    onClick={handleAdd}
                    disabled={addDisabled}>
                    {`Add ${name} (${maxCount - elementList.length}/${maxCount})`}
                </button>
                <button
                    className={`w-full bg-neutral-800 rounded-md font-semibold p-2 ${remDisabled ? 'brightness-75' : ''}`}
                    onClick={handleRemove}
                    disabled={remDisabled}>
                    {`Remove ${name} (${elementList.length}/${maxCount})`}
                </button>
            </div>
        </>
    )
}
