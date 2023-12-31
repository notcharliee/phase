import Footer from "@/components/Footer"
import Header from "@/components/Header"

// Exporting route group layout

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="font-poppins flex min-h-dvh flex-col justify-between bg-dark-900 bg-main text-light-800">
      <Header></Header>
      <main className="m-auto flex w-full max-w-6xl flex-col items-center justify-center p-8">
        {children}
      </main>
      <Footer></Footer>
    </div>
  )
}
