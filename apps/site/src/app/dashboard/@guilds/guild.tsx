"use client"

import Image from "next/image"
import { setGuild } from "./actions"

export const Guild = ({
  guild,
  selected,
  key,
}: {
  guild: {
    icon: string,
    name: string,
    id: string,
  },
  selected: string,
  key: number,
}) => (
  <button type="button" onClick={async (e) => {
    await setGuild(guild.id)
  }}>
    <Image
      src={guild.icon}
      width={56}
      height={56}
      alt=""
      key={key}
      className={"rounded duration-200 hover:saturate-100 hover:brightness-100 " + (guild.id == selected ? "border-2 border-dark-100" : "brightness-50 saturate-50")}
      title={guild.name}
    />
  </button>
)