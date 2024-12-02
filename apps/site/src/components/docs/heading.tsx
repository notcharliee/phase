export const Heading = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-8 space-y-2">{children}</div>
}

export const HeadingTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-4xl font-bold tracking-tight">{children}</h1>
}

export const HeadingDescription = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <p className="text-muted-foreground text-balance text-lg">{children}</p>
  )
}
