import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as FaRegular from "@fortawesome/free-regular-svg-icons"

import Modal from "@/components/Modal"
import SidebarDropdown from "@/components/SidebarDropdown"

export default (
  {
    text,
    type,
  }: {
    text?: "none" | "min" | "max"
    type?: "default" | "docs" | "dashboard"
  } = {
    text: "max",
    type: "default",
  },
) => {
  return (
    <Modal
      button={
        <button className="flex items-center gap-2 rounded-3xl border border-dark-600 bg-dark-700 bg-opacity-75 p-1.5 px-3 text-sm hover:bg-opacity-100">
          <FontAwesomeIcon
            icon={FaRegular.faCompass}
            className="h-4 w-4"
          ></FontAwesomeIcon>
          {text == "none" ? "" : text == "min" ? "quick nav" : "quick navigate"}
        </button>
      }
      heading={
        <span className="flex items-center gap-2">
          <h3 className="text-xl font-bold">Quick Navigate</h3>
          <FontAwesomeIcon
            icon={FaRegular.faCompass}
            className="h-5 w-5"
          ></FontAwesomeIcon>
        </span>
      }
    >
      <div className="flex flex-col gap-2 font-medium">
        <SidebarDropdown
          icon={FaRegular.faWindowMaximize}
          title="pages"
          items={[
            <Link href="/">Home</Link>,
            <Link href="/blog">Blog</Link>,
            <Link href="/dashboard">Dashboard</Link>,
            <Link href="/docs">Docs</Link>,
          ]}
          open
        ></SidebarDropdown>
        <SidebarDropdown
          icon={FaRegular.faWindowRestore}
          title="links"
          items={[
            <Link href="/redirect/donate">Donate</Link>,
            <Link href="/redirect/discord">Discord Server</Link>,
            <Link href="/redirect/github">GitHub Repository</Link>,
          ]}
          open
        ></SidebarDropdown>
        <SidebarDropdown
          icon={FaRegular.faHandshake}
          title="policies"
          items={[
            <Link href="/terms">Terms of Service</Link>,
            <Link href="/privacy">Privacy Policy</Link>,
          ]}
          open
        ></SidebarDropdown>
      </div>
    </Modal>
  )
}
