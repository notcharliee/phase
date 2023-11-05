import Link from 'next/link'


// Exporting page metadata

export const metadata = {
  title: 'Terms of Service - Phase',
}


// Exporting page tsx

export default () => {

  return (
    <main className='w-full max-w-6xl m-auto h-full flex flex-col flex-1 gap-6 p-8 py-16 font-semibold'>
      <h1 className='font-black select-none text-4xl sm:text-5xl text-center sm:text-left'>Terms of Service</h1>

      <h2 className='text-xl sm:text-2xl text-center sm:text-left'>Last Updated: October 23rd, 2023</h2>

      <ol className='list-decimal ml-4'>
        <li><a href='#1' className='text-blue-500'>Agreeing to Terms</a></li>
        <li><a href='#2' className='text-blue-500'>User Conduct</a></li>
        <li><a href='#3' className='text-blue-500'>Disclaimers</a></li>
        <li><a href='#4' className='text-blue-500'>Intellectual Property</a></li>
        <li><a href='#5' className='text-blue-500'>Termination</a></li>
        <li><a href='#6' className='text-blue-500'>Privacy Policy</a></li>
        <li><a href='#7' className='text-blue-500'>Contact Us</a></li>
      </ol>

      <h3 id='0' className='font-black text-3xl sm:text-4xl mt-8'>TL;DR Version</h3>
      <p>
        By using our services, you must follow these rules and local laws. We protect our website's content with copyright and trademark laws. Users must use our services responsibly and not harm others or disrupt service. Our services are provided without special guarantees, and we're not responsible for user-generated content. Our intellectual property is protected by copyright. We may terminate your access if you break the rules. We encourage you to review our <Link href='/privacy' target='_blank' className='text-blue-500'>Privacy Policy</Link> for data usage info and welcome you to contact our support team through Discord for questions or concerns.
      </p>

      <div className='mt-8 w-full h-1 bg-phase'></div>

      <h3 id='1' className='font-black text-2xl sm:text-3xl mt-8'>1. Agreeing to Terms</h3>
      <p>
        By accessing or using our services, you are agreeing to be bound by these Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing our services. The materials contained in this website are protected by applicable copyright and trademark law.
      </p>

      <h3 id='2' className='font-black text-2xl sm:text-3xl mt-8'>2. User Conduct</h3>
      <p>
        You agree to use our services only in a manner consistent with these terms. You agree not to use our services for unlawful, harassing, defamatory, obscene, or otherwise objectionable purposes. You also agree not to use our services in any manner that could damage, disable, overburden, or impair their functionality or interfere with any other users' use and enjoyment of them.
      </p>

      <h3 id='3' className='font-black text-2xl sm:text-3xl mt-8'>3. Disclaimers</h3>
      <p>
        Our services are provided "as is." We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of our services. We also disclaim responsibility for the accuracy or reliability of any third-party content provided through our services.
      </p>

      <h3 id='4' className='font-black text-2xl sm:text-3xl mt-8'>4. Intellectual Property</h3>
      <p>
        Content provided by our services, including but not limited to graphics, logos, and software code, is protected by copyright and other intellectual property laws. You retain ownership of the content that you create with us, but by using our services, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute your content solely for the purpose of providing and improving the services. Our services may also contain third-party content that is subject to its own intellectual property rights.
      </p>
      
      <h3 id='5' className='font-black text-2xl sm:text-3xl mt-8'>5. Termination</h3>
      <p>
        We reserve the right to suspend or terminate your access to some or all of our services with or without notice, at our discretion for the following reasons:
      </p>
      <ul className='ml-4 list-disc font-semibold'>
          <li className='mb-2'>You breach our terms or the terms of Discord.</li>
          <li className='mb-2'>We reasonably believe termination is necessary to prevent harm to you, us or other users.</li>
          <li>Giving you access to some or all of our services creates risk for us or other users.</li>
      </ul>
      <p>
        In the event of termination, all data associated with your account will permanently deleted.
      </p>

      <h3 id='6' className='font-black text-2xl sm:text-3xl mt-8'>6. Privacy Policy</h3>
      <p>
        Please review our <Link href='/privacy' className='text-blue-500'>Privacy Policy</Link> to understand how we collect, use, and protect the data you give us.
      </p>

      <h3 id='7' className='font-black text-2xl sm:text-3xl mt-8'>7. Contact Us</h3>
      <p>
        If you have any questions, concerns or feedback regarding our services or our policies, you may join our <Link href='/redirect/discord' target='_blank' className='text-blue-500'>Discord server</Link> and create a support ticket. It's open to everyone and we encourage all users to join so they may stay up to date with news, updates, and information regarding Phase.
      </p>
      <p>
        You should receive a response from a member of our support team typically within 20 minutes of creating a ticket.
      </p>
    </main>
  )

}