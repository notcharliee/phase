"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"
import React from "react"

export default ({
  children,
  button,
  heading,
  open,
}: {
  children: React.ReactNode
  button: React.ReactElement
  heading: React.ReactElement
  open?: boolean
}) => {
  const [mounted, setMounted] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(open ?? false)
  const pathname = usePathname()

  const backdrop = React.useRef<HTMLInputElement>(null)

  const closeModal = () => {
    setModalOpen(false)
  }

  const onBackdropClick = React.useCallback(
    (e: any) => {
      if (e.target == backdrop.current) closeModal()
    },
    [closeModal, backdrop],
  )

  const onKeyDown = React.useCallback(
    (e: any) => {
      if (e.key == "Escape" && modalOpen) closeModal()
    },
    [closeModal],
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  React.useEffect(() => {
    closeModal()
  }, [pathname])

  React.useEffect(() => {
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [onKeyDown])

  return mounted ? (
    <>
      {React.cloneElement(button, {
        onClick: () => {
          setModalOpen(true)
        },
      })}
      {createPortal(
        <>
          <div
            className="absolute z-40 left-0 top-0 flex h-full w-full items-center justify-center bg-dark-900/50"
            ref={backdrop}
            onClick={onBackdropClick}
            style={{ display: modalOpen ? "flex" : "none" }}
          >
            <div className="relative z-50 max-h-[calc(100vh-48px)] w-full max-w-md overflow-auto rounded-lg border border-dark-600 bg-dark-700 p-6 m-6 text-light-800 shadow">
              <div className="mb-4 flex items-center justify-between">
                {heading}
                <button onClick={closeModal} className="flex items-center">
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="h-5 w-5 text-light-100 hover:text-light-800 duration-150"
                  ></FontAwesomeIcon>
                </button>
              </div>
              {children}
            </div>
          </div>
        </>,
        document.getElementById("modals")!,
      )}
    </>
  ) : (
    <>
      {React.cloneElement(button, {
        onClick: () => {
          setModalOpen(true)
        },
      })}
    </>
  )
}
