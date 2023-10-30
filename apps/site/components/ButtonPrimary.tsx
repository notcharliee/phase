export default ({ children }: { children: React.ReactNode }) => {

  return (
    <div className='w-full sm:w-[200px] bg-light-900 text-dark-900 text-xl text-center font-cubano p-2.5 leading-none select-none phase-gradient-border-button border-l-light-900 border-t-light-900 duration-300 active:scale-95' children={children}></div>
  )

}