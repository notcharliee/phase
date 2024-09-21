export const formatDate = (date: Date) =>
  date.toLocaleString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  })
