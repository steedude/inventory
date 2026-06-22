export interface LowStockItem {
  user_id: string
  name: string
  quantity: number
  min_quantity: number
}

export interface NotificationSettingRow {
  user_id: string
  low_stock_daily_email_enabled: boolean
}
