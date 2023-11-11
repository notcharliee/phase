import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as FaRegular from "@fortawesome/free-regular-svg-icons"

import SidebarDropdown from "@/components/SidebarDropdown"
import SidebarLink from "@/components/SidebarLink"

// Exporting route group layout

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="font-poppins flex min-h-dvh flex-col gap-6 bg-dark-900 p-6 text-light-800 md:flex-row">
      <nav className="hidden max-h-[calc(100vh-48px)] min-h-full min-w-[280px] flex-col gap-8 overflow-y-auto rounded border border-dark-600 bg-dark-800 p-4 md:flex">
        <div className="flex flex-col gap-4">
          <SidebarLink
            icon={FaRegular.faUser}
            title="account"
            href="/dashboard"
          ></SidebarLink>
          <SidebarLink
            icon={FaRegular.faCommentAlt}
            title="guilds"
            href="/dashboard/guilds"
          ></SidebarLink>
          <SidebarLink
            icon={FaRegular.faFolder}
            title="documentation"
            href="/docs"
          ></SidebarLink>
        </div>
        <div className="flex flex-col gap-4">
          <SidebarDropdown
            icon={FaRegular.faFloppyDisk}
            title="modules"
            items={[
              <Link href="/dashboard/modules/afks">AFKs</Link>,
              <Link href="/dashboard/modules/auditlogs">Audit Logs</Link>,
              <Link href="/dashboard/modules/autopartners">Auto Partners</Link>,
              <Link href="/dashboard/modules/autoroles">Auto Roles</Link>,
              <Link href="/dashboard/modules/giveaways">Giveaways</Link>,
              <Link href="/dashboard/modules/jointocreate">
                Join to Create
              </Link>,
              <Link href="/dashboard/modules/levels">Levels & XP</Link>,
              <Link href="/dashboard/modules/reactionroles">
                Reaction Roles
              </Link>,
              <Link href="/dashboard/modules/reactionroles">Tickets</Link>,
            ]}
          ></SidebarDropdown>
          <SidebarDropdown
            icon={FaRegular.faHardDrive}
            title="commands"
            items={[<Link href="/docs/commands">Documentation</Link>]}
          ></SidebarDropdown>
          <SidebarDropdown
            icon={FaRegular.faPenToSquare}
            title="forms"
            items={[<Link href="/docs/forms">Documentation</Link>]}
          ></SidebarDropdown>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <Link
            href="/"
            className="w-full cursor-pointer select-none rounded border border-dark-800 bg-dark-900 p-3 pl-4 pr-4 font-medium text-light-100 shadow"
          >
            <FontAwesomeIcon
              icon={FaRegular.faCircleXmark}
              className="mr-2.5 inline-block h-4 w-4"
            ></FontAwesomeIcon>
            exit dashboard
          </Link>
        </div>
      </nav>
      <main className="min-h-[calc(100dvh-48px)] w-full break-words rounded border border-dark-600 bg-dark-800 p-4 md:max-w-[calc(100vw-352px)]">
        {children}
      </main>
    </div>
  )
}
