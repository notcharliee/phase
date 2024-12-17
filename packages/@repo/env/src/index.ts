import { bot } from "~/bot"
import { shared } from "~/shared"
import { www } from "~/www"

const envs = { bot, www, shared } as const

type EnvNames = keyof typeof envs
type EnvValues<TName extends EnvNames> = ReturnType<(typeof envs)[TName]>

export function getEnv<TName extends EnvNames>(name: TName): EnvValues<TName> {
  const env = envs[name]
  return env() as EnvValues<TName>
}
