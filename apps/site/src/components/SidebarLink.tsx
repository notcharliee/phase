'use client'

import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as FaSolid from '@fortawesome/free-solid-svg-icons'


export default ({ icon, title, href }: { icon: FaSolid.IconDefinition, title?: string, href: string }) => {

  return (
    <Link href={href} className='w-full bg-dark-700 hover:bg-dark-600 font-medium p-3 pl-4 pr-4 rounded shadow border border-dark-600'>
      <FontAwesomeIcon icon={icon} className='w-4 h-4 inline-block' style={{ marginRight: title ? '10px' : undefined }}></FontAwesomeIcon>
      {title ?? <></>}
    </Link>
  )

}