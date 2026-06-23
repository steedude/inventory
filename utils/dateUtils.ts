export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function getRecentDaysStart(days: number) {
  const date = new Date()

  date.setDate(date.getDate() - (days - 1))
  date.setHours(0, 0, 0, 0)

  return date
}
