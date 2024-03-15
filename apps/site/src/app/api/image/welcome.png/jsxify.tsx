export const jsxifyText = (text: string): JSX.Element => {
  const boldRegex = /\*\*(.*?)\*\*/g

  const parts: React.ReactNode[] = []
  let remainingText = text

  while (remainingText.length > 0) {
    const boldMatch = boldRegex.exec(remainingText)

    if (boldMatch) {
      const [fullMatch, innerText] = boldMatch
      const startIndex = remainingText.indexOf(fullMatch)
      const endIndex = startIndex + fullMatch.length

      if (startIndex > 0) {
        parts.push(
          <span key={startIndex}>{remainingText.slice(0, startIndex)}</span>,
        )
      }

      parts.push(
        <strong style={{ color: "#f8f8f8" }} key={startIndex}>
          <span>{innerText}</span>
        </strong>,
      )

      remainingText = remainingText.slice(endIndex)
    } else {
      parts.push(<span key={Math.random()}>{remainingText}</span>)
      remainingText = ""
    }
  }

  return (
    <div
      style={{
        color: "#C0C0C0",
        display: "flex",
        whiteSpace: "pre-wrap",
      }}
    >
      {parts}
    </div>
  )
}
