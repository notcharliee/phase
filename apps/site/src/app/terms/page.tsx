import { Metadata } from "next"
import Link from "next/link"


export const metadata: Metadata = {
  title: "Terms of Service - Phase Bot",
  description: "This document explains the expected user conduct, certain disclaimers, the rules around our intellectual property, and the process of usage termination."
}


export default () => (
  <main className="w-full max-w-[1400px] min-h-screen py-8 lg:py-16 px-8 lg:px-16 mx-auto">
    <div className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight">{metadata.title?.toString().replace(" - Phase Bot", "")}</h1>
      <p className="text-lg text-muted-foreground">{metadata.description}</p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">User Conduct</h2>
      <p className="leading-7">
        You agree to use our services only in a manner consistent with these terms. You agree not to use our services for unlawful, harassing, defamatory, obscene, or otherwise objectionable purposes. You also agree not to use our services in any intentional manner that could damage, disable, overburden, or impair functionality for other users.
      </p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Disclaimers</h2>
      <p className="leading-7">
        Our services are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of our services. We also disclaim responsibility for the accuracy or reliability of any third-party content provided through our services.
      </p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Intellectual Property</h2>
      <p className="leading-7">
        Content provided by our services, including but not limited to graphics, logos, and software code, is protected by copyright and other intellectual property laws. You retain ownership of the content that you create with us, but by using our services, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute your content solely for the purpose of providing and improving the services. Our services may also contain third-party content that is subject to its own intellectual property rights.
      </p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Process of Termination</h2>
      <p className="leading-7">
        We reserve the right to suspend or terminate your access to some or all of our services with or without notice, at our discretion for the following reasons:
      </p>
      <ul className="leading-7 ml-4 list-disc">
        <li className="mb-2">
          You breach our terms or the <strong><Link href={"https://discord.com/terms"} className="underline">terms of Discord</Link></strong>.
        </li>
        <li className="mb-2">
          We reasonably believe termination is necessary to prevent harm to you, us or other users.
        </li>
        <li>
          Giving you access to some or all of our services creates risk for us or other users.
        </li>
      </ul>
      <p className="leading-7">
        In the event of termination, all data associated with your account and owned servers will be deleted.
      </p>
    </div>
    <div className="mt-12 space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Last Updated</h2>
      <p className="leading-7">
        10th of January, 2024
      </p>
    </div>
  </main>
)
