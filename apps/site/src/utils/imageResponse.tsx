import { Font, FontWeight } from "next/dist/compiled/@vercel/og/satori"
import { ImageResponse } from "next/og"
import { absoluteURL } from "@/lib/utils"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export const imageResponse = async (params: {
  fonts: FontWeight[]
  width: number,
  height: number,
}, element: React.ReactElement<any, string | React.JSXElementConstructor<any>>) => {
  const fonts: Font[] = await Promise.all(
    params.fonts.map(async (weight) => ({
      data: await (await fetch(absoluteURL(`/fonts/Geist-${weight}.otf`))).arrayBuffer(),
      name: "Geist",
      style: "normal",
      weight,
    }))
  )

  return new ImageResponse((
    <main tw="w-full h-full font-[Geist,Arial]">
      {element}
    </main>
  ), {
    ...params,
    fonts,
  })
}
