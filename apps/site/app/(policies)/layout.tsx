import Footer from 'components/Footer'
import Header from 'components/Header'


// Exporting route group layout

export default ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-dark-900 font-poppins text-light-800 motion-safe:bg-main-gif motion-reduce:bg-main-static">
      <Header></Header>
        <main className="m-auto flex w-full max-w-6xl flex-col items-center justify-center p-8">
          {children}
        </main>
      <Footer></Footer>
    </div>
  )

}