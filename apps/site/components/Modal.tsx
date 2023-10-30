'use client'

import * as React from 'react'


export default ({ button, children }: { button: React.ReactElement, children: React.ReactNode }) => {

  const [modalVisibility, setModalVisibility] = React.useState(false)

  const overlay = React.useRef<HTMLInputElement>(null)

  const onDismiss = () => { setModalVisibility(!modalVisibility) }
  const onClick = React.useCallback((e: any) => { if (e.target == overlay.current) onDismiss() }, [onDismiss, overlay])
  const onKeyDown = React.useCallback((e: any) => { if (e.key == 'Escape' && modalVisibility) onDismiss() }, [onDismiss])


  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onKeyDown])


  return (
    <>
      {React.cloneElement(button, { onClick: onDismiss })}
      <div className='absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' style={{ display: modalVisibility ? 'flex' : 'none' }} children={children}></div>
      <div ref={overlay} className='bg-black/50 fixed inset-0 items-center justify-center z-40 w-full h-full' onClick={onClick} style={{ display: modalVisibility ? 'flex' : 'none' }}></div>
    </>
  )

}