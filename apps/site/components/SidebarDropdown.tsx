'use client'

import * as React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as FaSolid from '@fortawesome/free-solid-svg-icons'


export default ({ icon, title, items, disabled }: { icon: FaSolid.IconDefinition, title: string, items?: React.ReactElement[], disabled?: boolean }) => {

  const [linksVisibility, setLinksVisibility] = React.useState(false)
  const toggleLinksVisibility = () => !disabled ? setLinksVisibility(!linksVisibility) : setLinksVisibility(linksVisibility)

  const dropdownItem = (item: React.ReactElement, key: number) => React.cloneElement(item, { className: 'pl-4 p-2 hover:bg-dark-500 font-medium text-sm text-light-400 leading-none', key })

  return (
    <div>
      <div
        className={'w-full bg-dark-700 font-medium p-3 pl-4 pr-4 rounded select-none shadow border border-dark-600' + `${disabled
          ? ' cursor-not-allowed brightness-90'
          : ' cursor-pointer hover:bg-dark-600'
        }`} onClick={toggleLinksVisibility}
      >
        <FontAwesomeIcon icon={icon} className='w-4 h-4 mr-2.5 inline-block'></FontAwesomeIcon>
        {title}
        <FontAwesomeIcon icon={FaSolid.faAngleDown} className='w-4 h-4 float-right duration-150' style={{ transform: linksVisibility ? 'rotate(180deg)' : 'rotate(0deg)' }}></FontAwesomeIcon>
      </div>
      <div className='flex-col border-l ml-5 border-dark-600' style={{ display: linksVisibility ? 'flex' : 'none' }}>
        {items?.map((item, key) => {
          return dropdownItem(item, key)
        })}
      </div>
    </div>
  )

}