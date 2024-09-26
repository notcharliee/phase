import { z } from "zod"

const removeBracketsRegex = /\[([^\]]+)\]/g

const apiResponseSchema = z.object({
  list: z
    .object({
      word: z.string(),
      definition: z.string(),
      example: z.string(),
      author: z.string(),
      written_on: z.string(),
      permalink: z.string(),
      thumbs_up: z.number(),
      thumbs_down: z.number(),
      current_vote: z.string(),
      defid: z.number(),
    })
    .transform((post) => ({
      id: post.defid,
      url: post.permalink,
      word: post.word,
      definition: post.definition.replace(removeBracketsRegex, "$1"),
      example: post.example.replace(removeBracketsRegex, "$1"),
      author: post.author,
      thumbsUp: post.thumbs_up,
      thumbsDown: post.thumbs_down,
      createdAt: new Date(post.written_on),
    }))
    .array()
    .refine((posts): posts is UrbanPostArray => posts.length > 0),
})

export interface UrbanPost {
  id: number
  url: string
  word: string
  definition: string
  example: string
  author: string
  thumbsUp: number
  thumbsDown: number
  createdAt: Date
}

export type UrbanPostArray = [UrbanPost, ...UrbanPost[]]

export async function getUrbanPost(
  word: string,
): Promise<UrbanPostArray | null> {
  const baseApiUrl = "https://api.urbandictionary.com/v0/define?term="
  const fullApiUrl = baseApiUrl + encodeURIComponent(word)

  const apiResponse = await fetch(fullApiUrl)
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null)

  const parseResult = apiResponseSchema.safeParse(apiResponse)
  return parseResult.success ? parseResult.data.list : null
}
