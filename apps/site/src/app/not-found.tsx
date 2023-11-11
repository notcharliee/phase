import Link from "next/link"
import Image from "next/image"

import Footer from "@/components/Footer"
import Header from "@/components/Header"

// Exporting page metadata

export const metadata = {
  title: "Page Not Found - Phase",
}

// Exporting page tsx

export default () => {
  return (
    <div className="font-poppins flex min-h-dvh flex-col bg-dark-900 bg-main text-light-900">
      <Header></Header>
      <main className="m-auto flex h-full w-full max-w-6xl flex-1 flex-col-reverse items-center justify-between gap-8 p-8 pb-32 pt-32 lg:flex-row">
        <div className="flex max-w-[600px] flex-col gap-6">
          <h1 className="select-none text-left text-4xl font-black sm:text-5xl">
            Page not found
          </h1>
          <p className="font-semibold">
            You look lost, but don't worry, we've got your back. The page you're
            searching for seems to have disappeared, but it might be back soon.
            In the meantime, why not explore some of our other pages?
          </p>
          <ul>
            <li>
              <Link href="/" className="font-semibold text-blue-500">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="font-semibold text-blue-500">
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/redirect/discord"
                className="font-semibold text-blue-500"
              >
                Support
              </Link>
            </li>
          </ul>
        </div>
        <Image
          src="/smpte-tv.png"
          alt="404"
          width={348.99}
          height={240}
          className="mb-8 lg:mb-0"
        ></Image>
      </main>
      <Footer></Footer>
    </div>
  )
}
