export type LayoutProps<
  T extends string | string[] | string[][] | undefined = undefined,
> = Readonly<
  {
    children: React.ReactNode
  } & (T extends string
    ? { params: { [K in T]: string } }
    : T extends string[]
      ? { params: { [K in T[number]]: string } }
      : T extends string[][]
        ? { params: { [K in T[number][number]]: string } }
        : never)
>
