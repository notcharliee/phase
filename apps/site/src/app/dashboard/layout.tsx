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
    <div className="md:max-w-[20rem] lg:max-w-[24rem] w-full min-h-full flex flex-col-reverse md:flex-col gap-4 md:grow">
      <div className="h-full">{settings}</div>
      <div className="h-min">{user}</div>
    </div>
  </main>
)