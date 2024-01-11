export default ({
  user,
  modules,
  settings,
}: {
  user: React.ReactNode,
  modules: React.ReactNode,
  settings: React.ReactNode,
}) => (
  <main className="flex flex-col-reverse md:flex-row gap-4 p-8 min-h-screen md:max-h-screen">
    {modules}
    <div className="w-96 min-h-full flex flex-col gap-4 grow">
      <div className="h-full">{settings}</div>
      <div className="h-min">{user}</div>
    </div>
  </main>
)