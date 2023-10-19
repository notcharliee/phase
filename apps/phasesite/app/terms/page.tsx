// next
import Link from 'next/link'


export const metadata = { title: 'Terms of Service' }
export const dynamic = 'force-static'

export default function page() {
    return (
        <>
            <div className='w-full max-w-[1472px] flex flex-col gap-16 text-left self-center'>
                <span className='flex flex-col gap-8'>
                    <h1 className='font-lilita uppercase text-3xl sm:text-4xl'>Terms of Service</h1>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        By accessing or using our services, you are agreeing to be bound by these Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing our services. The materials contained in this website are protected by applicable copyright and trademark law.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>User Conduct</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        You agree to use our services only in a manner consistent with these terms. You agree not to use our services for unlawful, harassing, defamatory, obscene, or otherwise objectionable purposes. You also agree not to use our services in any manner that could damage, disable, overburden, or impair their functionality or interfere with any other users' use and enjoyment of them.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>Disclaimer</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        Our services are provided "as is." We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of our services. We also disclaim responsibility for the accuracy or reliability of any third-party content provided through our services.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>Intellectual Property</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        Content provided by our services, including but not limited to graphics, logos, and software code, is protected by copyright and other intellectual property laws. You retain ownership of the content that you create with us, but by using our services, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute your content solely for the purpose of providing and improving the services. Our services may also contain third-party content that is subject to its own intellectual property rights.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>Termination</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        We reserve the right to suspend or terminate your access to some or all of the our services with or without notice, at our discretion for the following reasons:

                        <ul className='m-4 list-disc'>
                            <li>You breach our terms or the terms of Discord.</li>
                            <li>We reasonably believe termination is necessary to prevent harm to you, us or other users.</li>
                            <li>Giving you access to some or all of our services creates risk for us or other users.</li>
                        </ul>
                        
                        In the event of termination, all data associated with your account will permanently deleted.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>Privacy Policy</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        Please review our <Link href='/privacy' target='_blank' className='gradient-text'>Privacy Policy</Link> to understand how we collect, use, and protect the data you give us.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>Contact Us</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        If you have any questions, concerns or feedback regarding our services or our policies, you may join our <Link href='/redirect/discord' target='_blank' className='gradient-text'>Discord server</Link> and create a support ticket. It's open to everyone and we encourage all users to join so they may stay up to date with news, updates, and information regarding Phase.<br></br><br></br>
                        
                        You should receive a response from a member of our support team typically within 20 minutes of creating a ticket. However if you need to speak with the developer of Phase individually, you may DM them upon joining the Discord server. 
                    </p>
                </span>
            </div>
        </>
    )
}