import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as FaRegular from '@fortawesome/free-regular-svg-icons'

import Modal from 'components/Modal'
import QuickNavigate from 'components/QuickNavigate'
import SidebarDropdown from 'components/SidebarDropdown'


export default () => {

  return (
    <header className="w-full bg-transparent font-medium text-light-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <Link href='/' className="text-2xl font-bold">
          <span>phase</span>
          <span className="text-phase">bot</span>
        </Link>
        <QuickNavigate></QuickNavigate>
      </div>
    </header>
  )

}