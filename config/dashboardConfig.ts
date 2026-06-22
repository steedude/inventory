export const categoryChartColors = [
  '#2563eb',
  '#16a34a',
  '#f59e0b',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
  '#db2777',
  '#4f46e5',
]

export const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label(context: { label: string, parsed: number }) {
          return `${context.label}: ${context.parsed}`
        },
      },
    },
  },
}
