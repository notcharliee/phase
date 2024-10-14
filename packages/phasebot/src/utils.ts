import ora from "ora"

export const spinner = (params?: Parameters<typeof ora>[0]) => {
  if (typeof params === "string") params = { text: params }

  return ora({
    color: "white",
    interval: 20,
    stream: process.stdout as unknown as NodeJS.WritableStream,
    ...params,
  })
}
