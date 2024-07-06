export const Heading = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-2 mb-8">{children}</div>
}

export const HeadingTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-4xl font-bold tracking-tight">{children}</h1>
}

export const HeadingDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-muted-foreground text-lg text-balance">{children}</p>
}