export type LayoutProps<
  T extends string | string[] | string[][] | undefined = undefined,
> = Readonly<
  {
    children: React.ReactNode
  } & (T extends string
    ? { params: Promise<Record<T, string>> }
    : T extends string[]
      ? { params: Promise<Record<T[number], string>> }
      : T extends string[][]
        ? { params: Promise<Record<T[number][number], string>> }
        : never)
>
