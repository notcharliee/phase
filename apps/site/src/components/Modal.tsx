'use client'

import React from 'react'
import { createPortal } from 'react-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as FaSolid from '@fortawesome/free-solid-svg-icons'


export default ({
  children,
  button,
  heading,
  open,
}: {
  children: React.ReactNode,
  button: React.ReactElement,
  heading: React.ReactElement,
  open?: boolean,
}) => {

  const [mounted, setMounted] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(open ?? false)

  const backdrop = React.useRef<HTMLInputElement>(null)

  const closeModal = () => { setModalOpen(false) }

  const onClick = React.useCallback((e: any) => { if (e.target == backdrop.current) closeModal() }, [closeModal, backdrop])
  const onKeyDown = React.useCallback((e: any) => { if (e.key == 'Escape' && modalOpen) closeModal() }, [closeModal])

  React.useEffect(() => { setMounted(true) }, [])

  React.useEffect(() => {

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {

      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''

    }

  }, [onKeyDown])

  return mounted
  ? <>
      {React.cloneElement(button, { onClick: () => { setModalOpen(true) } })}
      {createPortal(<>
        <div className='bg-dark-900/50 absolute top-0 left-0 w-full h-full flex items-center justify-center' ref={backdrop} onClick={onClick} style={{ display: modalOpen ? 'flex' : 'none' }}>
          <div className='w-full max-w-sm relative z-50 max-h-[calc(100vh-48px)] overflow-auto bg-dark-800/50 backdrop-blur-md text-light-800 p-6 rounded-lg shadow border border-dark-600'>
            <div className='flex items-center justify-between mb-4'>
              {heading}
              <button onClick={closeModal} className='flex items-center'>
                <FontAwesomeIcon icon={FaSolid.faXmark} className='text-light-100 hover:text-light-800 w-5 h-5'></FontAwesomeIcon>
              </button>
            </div>
            {children}
          </div>
        </div>
      </>, document.getElementById('modals')!)}
    </>
  : <>{React.cloneElement(button, { onClick: () => { setModalOpen(true) } })}</>

}