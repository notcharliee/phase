import { type Metadata } from "next"

import { getAuthCredentials, getUser } from "../_cache/user"
import { DashboardHeader } from "../components/header"

export const metadata = {
  title: "Settings",
} satisfies Metadata

export default async function Page() {
  const { user } = await getUser(...getAuthCredentials())

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-8">
      <DashboardHeader
        name={user.global_name}
        avatar={user.avatar_url}
        title={metadata.title}
      />
      This page is still being worked on. Give me a few days! 🚧
    </div>
  )
}
