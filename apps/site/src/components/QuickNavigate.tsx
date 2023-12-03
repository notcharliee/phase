import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCompass } from "@fortawesome/free-regular-svg-icons"
import Link from "next/link"
import Modal from "@/components/Modal"

export default ({ text }: { text?: "none" | "min" | "max" } = { text: "max" }) => {
  return (
    <Modal
      button={
        <button className="flex items-center gap-2 rounded-3xl border border-dark-600 bg-dark-700 bg-opacity-75 p-1.5 px-3 text-sm hover:bg-opacity-100">
          <FontAwesomeIcon
            icon={faCompass}
            className="h-4 w-4"
          ></FontAwesomeIcon>
          {text == "none" ? "" : text == "min" ? "quick nav" : "quick navigate"}
        </button>
      }
      heading={
        <span className="flex items-center gap-2">
          <h3 className="text-xl font-bold">Quick Navigate</h3>
          <FontAwesomeIcon
            icon={faCompass}
            className="h-5 w-5"
          ></FontAwesomeIcon>
        </span>
      }
    >
      <div className="flex flex-col gap-6 font-medium text-light-400">
        <ul className='list-disc ml-4'>
          <h3 className='font-bold -ml-4 text-light-800'>Main Pages</h3>
          <li className='duration-150 hover:text-phase'><Link href="/">Home</Link></li>
          <li className='duration-150 hover:text-phase'><Link href="/blog">Blog</Link></li>
          <li className='duration-150 hover:text-phase'><Link href="/dashboard">Dashboard</Link></li>
        </ul>
        <ul className='list-disc ml-4'>
          <h3 className='font-bold -ml-4 text-light-800'>Documentation</h3>
          <li className='duration-150 hover:text-phase'><Link href="/docs">Introduction</Link></li>
          <li className='duration-150 hover:text-phase'><Link href="/docs/modules">Modules</Link></li>
          <li className='duration-150 hover:text-phase'><Link href="/docs/commands">Commands</Link></li>
          <li className='duration-150 hover:text-phase'><Link href="/docs/api">Developer API</Link></li>
        </ul>
        <ul className='list-disc ml-4'>
          <h3 className='font-bold -ml-4 text-light-800'>External Links</h3>
          <li className='duration-150 hover:text-phase'><Link href="/redirect/donate">Donate</Link></li>
          <li className='duration-150 hover:text-phase'><Link href="/redirect/discord">Discord Server</Link></li>
          <li className='duration-150 hover:text-phase'><Link href="/redirect/github">Source Code</Link></li>
        </ul>
        <ul className='list-disc ml-4'>
          <h3 className='font-bold -ml-4 text-light-800'>Policies & Documents</h3>
          <li className='duration-150 hover:text-phase'><Link href="/terms">Terms of Service</Link></li>
          <li className='duration-150 hover:text-phase'><Link href="/privacy">Privacy Policy</Link></li>
        </ul>
      </div>
    </Modal>
  )
}
