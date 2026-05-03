export interface ChartCardProps {
  title: string
  info?: string
  onClose?: () => void
  children: React.ReactNode
}