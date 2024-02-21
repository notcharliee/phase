import { Commands } from "../components/commands"

export default function CommandsLoading() {
  return (
    <div className="grid h-full gap-4 p-8 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Commands fallback />
    </div>
  )
}
