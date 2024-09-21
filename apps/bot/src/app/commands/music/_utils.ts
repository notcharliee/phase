export function createProgressBar(
  percentage: number,
  status: "paused" | "resumed",
) {
  const barLength = 10
  const mediaControlSymbol = status === "paused" ? " ❚❚ " : " ► "
  const position = Math.round(percentage * barLength)

  let progressBar = "▬".repeat(barLength)

  progressBar =
    progressBar.substring(0, position) +
    mediaControlSymbol +
    progressBar.substring(position + 1)

  return progressBar
}
