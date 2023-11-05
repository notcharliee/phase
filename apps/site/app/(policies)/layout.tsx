import Footer from 'components/Footer'
import Header from 'components/Header'


// Exporting route group layout

export default ({ children }: { children: React.ReactNode }) => {

  return (
    <body className='font-poppins bg-neutral-900 motion-safe:bg-main-gif motion-reduce:bg-main-static text-white min-h-dvh flex flex-col'>
      <Header></Header>
      {children}
      <Footer></Footer>
    </body>
  )

}