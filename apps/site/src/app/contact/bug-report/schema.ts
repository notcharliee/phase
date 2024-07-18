import { z } from "zod"

export const formSchema = z.object({
  guildId: z.string().optional(),
  channelId: z.string().optional(),
  subject: z.string().min(1),
  urgency: z.enum(["low", "medium", "high"]),
  body: z.string().min(1),
})

export type FormValues = z.infer<typeof formSchema>
