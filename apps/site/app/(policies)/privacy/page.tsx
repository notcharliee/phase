import Link from 'next/link'


// Exporting page metadata

export const metadata = {
  title: 'Privacy Policy - Phase',
}


// Exporting page tsx

export default () => {

  return (
    <main className='w-full max-w-6xl m-auto h-full flex flex-col flex-1 gap-6 p-8 pt-32 pb-32 font-semibold'>
      <h1 className='font-black select-none text-4xl sm:text-5xl text-center sm:text-left'>Privacy Policy</h1>

      <h2 className='text-xl sm:text-2xl'>Last Updated: November 2nd, 2023</h2>

      <ol className='list-decimal ml-4'>
        <li><a href='#1' className='text-blue-500'>Information we collect</a></li>
        <li><a href='#2' className='text-blue-500'>How we store data</a></li>
        <li><a href='#3' className='text-blue-500'>How we keep data safe</a></li>
        <li><a href='#4' className='text-blue-500'>Data deletion</a></li>
        <li><a href='#5' className='text-blue-500'>Terms of Service</a></li>
        <li><a href='#6' className='text-blue-500'>Contact Us</a></li>
      </ol>

      <h3 id='0' className='font-black text-3xl sm:text-4xl mt-8'>TL;DR Version</h3>
      <p>
        Our privacy policy outlines that Phase only collects and stores data essential for its bot and website dashboard's functionality, ensuring no data is shared or sold to third parties. User data, such as names, IDs, and avatars/icons, may be collected, along with Discord OAuth2 tokens via the website dashboard. We use secure MongoDB storage, maintain strict access controls, and employ robust security measures to protect data. Users can request manual data deletion at any time. We encourage you to review our <Link href='/terms' className='text-blue-500'>Terms of Service</Link> for service usage rules and welcome you to contact our support team through Discord for questions or concerns.
      </p>

      <div className='mt-8 w-full h-1 bg-phase'></div>

      <h3 id='1' className='font-black text-2xl sm:text-3xl mt-8'>1. Information we collect</h3>
      <p>
        Phase only stores data when necessary for the functionality of the bot and website dashboard. This means that no data is stored about you simply by sharing a guild with the bot, and we never share or sell data to any third parties under any circumstances.
      </p>
      <p>
        Examples of data we may collect through the usage of slash commands and modules include channel, message, guild, and user names, IDs, and avatars/icons. When using the website dashboard, we collect your Discord OAuth2 tokens, your user ID, and a list of your guilds.
      </p>

      <h3 id='2' className='font-black text-2xl sm:text-3xl mt-8'>2. How we store data</h3>
      <p>
        We utilize a NoSQL MongoDB database to securely store and protect data. Access to the database is strictly limited to the owner of Phase and the bot itself. Data is used only within the scope required for developing, testing, and implementing the services Phase offers, and it is never shared or sold to third parties.
      </p>

      <h3 id='3' className='font-black text-2xl sm:text-3xl mt-8'>3. How we keep data safe</h3>
      <p>
        We implement robust security measures to safeguard user and guild data from unauthorized access or disclosure. Active security procedures are in place on both our end and within MongoDB to ensure data security.
      </p>
      <p>
        However, while we take every precaution, no data transmission on the internet can be guaranteed to be 100% secure, and there is always a potential for a data breach. In the event of a breach, we will promptly inform all members of our <Link href='/redirect/discord' target='_blank' className='text-blue-500'>Discord server</Link> and take immediate steps to contain the breach and address any vulnerabilities.
      </p>

      <h3 id='4' className='font-black text-2xl sm:text-3xl mt-8'>4. Data deletion</h3>
      <p>
        Users have the option to delete their stored data related to their Discord account and any servers that Phase is a part of from the database at any time. Since data may be distributed across multiple Discord servers and parts of the database, we perform this process manually to ensure thorough data removal. To initiate this process, please contact the owner of Phase through our <Link href='/redirect/discord' target='_blank' className='text-blue-500'>Discord server</Link>'s ticket system.
      </p>

      <h3 id='5' className='font-black text-2xl sm:text-3xl mt-8'>5. Terms of Service</h3>
      <p>
        Please review our <Link href='/terms' className='text-blue-500'>Terms of Service</Link> to understand the rules and guidelines you must adhere to when using our services.
      </p>

      <h3 id='6' className='font-black text-2xl sm:text-3xl mt-8'>6. Contact Us</h3>
      <p>
      If you have any questions, concerns, or feedback about our services or policies, please join our <Link href='/redirect/discord' target='_blank' className='text-blue-500'>Discord server</Link> and create a support ticket. Our server is open to everyone, and we encourage all users to join to stay informed about news, updates, and information regarding Phase. A member of our support team typically responds to tickets within 20 minutes of creation.
      </p>
    </main>
  )

}