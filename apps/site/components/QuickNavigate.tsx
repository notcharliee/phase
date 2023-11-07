import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as FaRegular from '@fortawesome/free-regular-svg-icons'

import Modal from 'components/Modal'
import SidebarDropdown from 'components/SidebarDropdown'


export default ({ text }: { text?: 'none' | 'min' | 'max' } = { text: 'max' }) => {

  return (
    <Modal button={
      <button className='flex items-center gap-2 text-sm rounded-3xl border border-dark-600 bg-dark-700 bg-opacity-75 p-1.5 px-3 hover:bg-opacity-100'>
        <FontAwesomeIcon icon={FaRegular.faCompass} className='w-4 h-4'></FontAwesomeIcon>
        {text == 'none' ? '' : text == 'min' ? 'quick nav' : 'quick navigate'}
      </button>
    }>
      <div className='w-full max-h-[calc(100vh-48px)] overflow-auto bg-dark-700/50 backdrop-blur-md text-light-900 font-medium p-5 rounded-lg shadow border border-dark-600 flex flex-col gap-2'>
        <span className='flex items-center gap-2 mb-2'>
          <h3 className='font-bold text-xl'>Quick Navigate</h3>
          <FontAwesomeIcon icon={FaRegular.faCompass} className='w-5 h-5'></FontAwesomeIcon>
        </span>
        <SidebarDropdown
          icon={FaRegular.faWindowMaximize}
          title='pages'
          items={[
            <Link href='/'>Home</Link>,
            <Link href='/blog'>Blog</Link>,
            <Link href='/dashboard'>Dashboard</Link>,
            <Link href='/docs'>Docs</Link>,
          ]}
          open
        ></SidebarDropdown>
        <SidebarDropdown
          icon={FaRegular.faWindowRestore}
          title='links'
          items={[
            <Link href='/redirect/donate'>Donate</Link>,
            <Link href='/redirect/discord'>Discord Server</Link>,
            <Link href='/redirect/github'>GitHub Repository</Link>,
          ]}
          open
        ></SidebarDropdown>
        <SidebarDropdown
          icon={FaRegular.faHandshake}
          title='policies'
          items={[
            <Link href='/terms'>Terms of Service</Link>,
            <Link href='/privacy'>Privacy Policy</Link>,
          ]}
          open
        ></SidebarDropdown>
      </div>
    </Modal>
  )

}