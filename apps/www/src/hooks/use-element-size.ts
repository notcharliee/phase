import * as React from "react"

export function useElementSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = React.useState<[number, number]>([0, 0])

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    // Function to update width state
    const updateSize = () => {
      setSize([element.offsetWidth, element.offsetHeight])
    }

    // Create a resize observer
    const resizeObserver = new ResizeObserver(() => updateSize())
    resizeObserver.observe(element)

    // Initial width update
    updateSize()

    // Clean up observer on component unmount
    return () => {
      resizeObserver.disconnect()
    }
  }, [ref])

  return size
}
