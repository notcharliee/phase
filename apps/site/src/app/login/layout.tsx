export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="bg-image absolute top-0 -z-50 h-screen w-screen"></div>
      <main className="grid h-screen place-items-center p-8">{children}</main>
    </>
  )
}
