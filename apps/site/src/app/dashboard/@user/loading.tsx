export default () => (
  <div className="bg-dark-800 border-2 border-dark-400 rounded-xl p-6 h-full flex flex-col gap-4">
    <div className="flex gap-5 items-center animate-pulse">
      <div className="rounded w-[72px] h-[72px] bg-dark-100/75"></div>
      <div className="flex flex-col gap-1">
        <span className="rounded w-16 h-7 bg-dark-100/75"></span>
        <span className="rounded w-24 h-6 bg-dark-100/75"></span>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 text-sm animate-pulse">
      <div className="rounded bg-dark-100/75 text-transparent p-3">Sign Out</div>
      <div className="rounded bg-dark-100/75 text-transparent p-3">View Token</div>
      <div className="rounded bg-phase text-transparent p-3">Delete Data</div>
    </div>
  </div>
)
