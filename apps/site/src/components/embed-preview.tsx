interface EmbedPreviewProps {
  title?: string
  description?: string
  mention?: string
}

export const EmbedPreview = (props: EmbedPreviewProps) => {
  return (
    <div className="w-full rounded-md border bg-[#2f3136] p-2.5">
      <div className="flex gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/phase.png"
          alt=""
          width={40}
          height={40}
          className="max-h-10 rounded-full"
        />
        <div className="flex flex-col">
          <div className="text-foreground flex items-center gap-1.5">
            <div className="text-base font-medium">Phase</div>
            <div className="flex h-4.5 items-center rounded bg-[#5865F2] px-[5px] text-[10px]">
              BOT
            </div>
          </div>
          {props.mention && (
            <div className="w-min rounded bg-[#5865F2]/50 text-[15px] font-medium leading-snug text-[#c9cdfb]">
              <span className="whitespace-nowrap px-[3.75px]">
                {"@" + props.mention}
              </span>
            </div>
          )}
          <div className="border-foreground mt-1 flex max-w-full sm:max-w-[516px] flex-col rounded border-l-4 bg-[#202225] pb-4 pl-3 pr-4 pt-2">
            {props.title && (
              <span className="mt-1 text-[15px] font-semibold break-all">
                {props.title}
              </span>
            )}
            {props.description && (
              <p className="mt-1 text-sm break-all">
                {props.description.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
