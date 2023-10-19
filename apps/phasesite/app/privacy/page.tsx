// next
import Link from 'next/link'


export const metadata = { title: 'Privacy Policy' }
export const dynamic = 'force-static'

export default function page() {
    return (
        <>
            <div className='w-full max-w-[1472px] flex flex-col gap-16 text-left self-center'>
                <span className='flex flex-col gap-8'>
                    <h1 className='font-lilita uppercase text-3xl sm:text-4xl'>Privacy Policy</h1>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        Phasebot.xyz (“Phase”, “we”, “us” or “our”) is committed to protecting your privacy. This Privacy Policy explains the methods and reasons we collect, use, disclose, and store your information. If you have any questions about the contents of this policy, don’t hesitate to contact us.<br></br><br></br>If you do not consent to the collection and use of information from or about you in accordance with this Privacy Policy, then you are not permitted to use Phase or any services provided on <Link href='https://phasebot.xyz' target='_blank' className='gradient-text'>https://phasebot.xyz</Link>.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>Information We Collect</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        When you use Phase in a server without logging in, we will only ever store message, server, channel, role, or member data and no other information will be collected. This data is used to provide Phase's features and services to you and is necessary for core functionality.<br></br><br></br>

                        Upon logging in, Phase will be given access to view your Discord username, avatar, and banner as well as a list of servers you are in. This data is used to create the account dashboard and other login-specific pages which allows you to configure Phase's settings. Changes made on and saved on these pages will result in the submitted data being logged to the Utils.Schemas.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>How we store data</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        Phase uses a <Link href='https://mongodb.com' target='_blank' className='gradient-text'>MongoDB</Link> database to store data. Phase will only store data within the scope required for the development, testing or implementation of our services. No stored data is shared, sold, or given to any third party under any circumstances.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>How we keep data safe</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        We take many steps to protect your data from unauthorised access, use, or disclosure and we have regular security procedures in place to keep your data safe. However, no data transmission over the Internet can be guaranteed to be 100% secure in all circumstances as there is always as chance of a data breach. Therefore, in the event of any unauthorised access to the database, we will inform you via our <Link href='/redirect/discord' target='_blank' className='gradient-text'>Discord server</Link>.
                    </p>
                </span>
                <span className='flex flex-col gap-8'>
                    <h2 className='font-lilita uppercase text-3xl sm:text-4xl'>Data Deletion</h2>
                    <p className='font-semibold text-neutral-300 text-left text-md'>
                        In accordance with GDPR, all users have the option to delete data pertaining to their individual Discord account. To do this, please head to <Link href='/account' target='_blank' className='gradient-text'>https://phasebot.xyz/account</Link> and scroll down to the “Danger Zone” section and follow the instructions.<br></br><br></br>

                        If, however, you simply wish to revoke Phase's access to your data without deleting your presence entirely, you may do so by removing Phase from your “Authorised Apps” list in your Discord user settings. This will not delete the data already in our database, but will prevent Phase from collecting any more.
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