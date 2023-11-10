import Link from 'next/link'


export default () => {

  return (
    <footer className="w-full border-t border-dark-600 bg-dark-900 text-sm font-medium text-light-100 md:text-base">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="flex flex-col md:flex-row-reverse md:justify-between">
          <div className="flex gap-4">
            <Link href="/docs" className='hover:text-light-500'>docs</Link>
            <Link href="/blog" className='hover:text-light-500'>blog</Link>
            <Link href="/redirect/github" className='hover:text-light-500'>github</Link>
            <Link href="/redirect/donate" className='hover:text-light-500'>donate</Link>
          </div>
          <span className="mt-4 md:mt-0">
            built by {' '}
            <Link href="https://github.com/notcharliee" className='hover:text-light-500'>notcharliee</Link>.
          </span>
        </div>
      </div>
    </footer>
  )

}