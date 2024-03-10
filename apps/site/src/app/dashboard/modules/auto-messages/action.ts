"use server"

import { cookies, headers } from "next/headers"

import { type Reminder, ReminderSchema } from "@repo/schemas"

import { updateModule } from "@/lib/actions"

import { type FormValues } from "./form"

export const addAutoMessages = async (data: FormValues) => {
  let guildId = cookies().get("guild")?.value
  let userId = headers().get("x-user-id")

  try {
    const messages = data.messages.map((message) => ({
      name: message.name,
      channel: message.channel,
      message: message.message,
      mention: message.mention,
      interval: +message.interval,
    }))

    await updateModule("AutoMessages", {
      ...data,
      messages,
    })

    guildId = guildId!
    userId = userId!

    const documents: Reminder[] = []

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]!

      documents.push({
        guild: guildId,
        name: message.name,
        message: message.message,
        channel: message.channel,
        time: message.interval,
        loop: true,
        user: userId,
        role: message.mention,
        created: data.messages[i]!.startAt ?? new Date(),
        unsent: true,
      })
    }

    await ReminderSchema.deleteMany({
      guild: guildId,
      loop: true,
    })

    await ReminderSchema.insertMany(documents)
  } catch (error) {
    throw error
  }
}
