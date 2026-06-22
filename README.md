# 庫存管理系統

一個以 Nuxt 4 與 Supabase 建立的庫存管理系統，支援多使用者登入、物品分類、條碼快速查找、圖片上傳、庫存異動紀錄，以及低庫存 Email 通知。

## 功能

- Email / Google 登入
- 物品新增、編輯、刪除與清單檢視
- 大類別、小類別、群組、位置設定
- 條碼輸入、圖片辨識條碼、即時相機掃描
- 物品圖片上傳與預覽
- 低庫存警示與低庫存清單
- 手動寄送目前使用者的低庫存通知
- 每日排程寄送低庫存通知
- 使用者可自行開關每日低庫存通知
- 庫存異動紀錄，記錄建立、更新、刪除與變更欄位
- 首頁統計、圓餅圖與最近 7 天異動紀錄
- 繁體中文 / English i18n

## 技術棧

- Nuxt 4
- Vue 3
- TypeScript
- Nuxt UI
- Tailwind CSS
- Pinia
- Supabase Auth / PostgreSQL / Storage
- Resend
- Chart.js / vue-chartjs
- ZXing barcode scanner
- Cloudflare Workers Cron Trigger

## 專案結構

```txt
app/                 Nuxt app pages, layouts, components, composables
config/              UI、圖表、庫存紀錄等設定
i18n/                多語系文字
server/api/          Nuxt server API
server/utils/        Server-only utilities
types/               共用 TypeScript 型別
utils/               前後端共用工具
supabase-schema.sql  Supabase schema 與 RLS policies
```

## 環境變數

複製 `.env.example` 成 `.env`，並填入以下設定：

```txt
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
INVENTORY_CRON_SECRET=
RESEND_API_KEY=
LOW_STOCK_FROM_EMAIL=
```

說明：

- `SUPABASE_URL`：Supabase project URL
- `SUPABASE_KEY`：Supabase anon key，前端使用
- `SUPABASE_SERVICE_ROLE_KEY`：Server API 使用，不能暴露到前端
- `INVENTORY_CRON_SECRET`：Nuxt API 與 Cloudflare Worker 共用的排程驗證密鑰
- `RESEND_API_KEY`：Resend API key
- `LOW_STOCK_FROM_EMAIL`：低庫存通知寄件者，例如 `Inventory <notify@example.com>`

## Supabase 設定

1. 建立 Supabase 專案。
2. 到 SQL Editor 貼上並執行 `supabase-schema.sql`。
3. 確認 RLS 已啟用。
4. 建立 Storage bucket，用於物品圖片上傳。
5. 將 Supabase URL、anon key、service role key 填入 `.env`。

`supabase-schema.sql` 會建立：

- `categories`
- `locations`
- `item_groups`
- `items`
- `inventory_logs`
- `user_settings`

並包含對應 indexes、updated_at trigger、RLS policies。

## 低庫存通知

系統有兩種低庫存通知：

- 手動通知：使用者在首頁按「發送低庫存通知」，只會寄送目前登入使用者自己的低庫存商品。
- 每日排程：Cloudflare Worker 觸發 `/api/inventory/low-stock-check`，掃描所有使用者，並依照每個使用者的「每天凌晨 12 點接收」設定寄信。

每日排程 Worker 在另一個專案 `inventory-cron-worker`。Worker 需要設定：

```txt
INVENTORY_APP_URL=
INVENTORY_CRON_SECRET=
```

`INVENTORY_CRON_SECRET` 必須與本 Nuxt 專案一致。

## 開發

安裝依賴：

```powershell
pnpm install
```

啟動開發伺服器：

```powershell
pnpm dev
```

預設會在：

```txt
http://localhost:3000
```

## 驗證

```powershell
pnpm lint
pnpm typecheck
pnpm build
```

## 部署

本專案可部署到 Vercel、Netlify 或其他支援 Nuxt 的平台。

部署時請設定與 `.env.example` 相同的環境變數。`SUPABASE_SERVICE_ROLE_KEY`、`INVENTORY_CRON_SECRET`、`RESEND_API_KEY` 都只能放在 server-side 環境變數，不能暴露到 client。

## 安全性

- 前端會直接使用 Supabase anon key 呼叫 Supabase REST API，這是 Supabase 的正常用法。
- 資料隔離依靠 Supabase RLS policies。
- `SUPABASE_SERVICE_ROLE_KEY` 只在 Nuxt server API 使用，不可放到 public runtime config。
- 排程 API 透過 `INVENTORY_CRON_SECRET` 驗證。
