# 庫存管理系統

庫存管理系統是一個以 Nuxt 4、TypeScript、Supabase 與 Cloudflare Workers 建立的全端庫存管理專案，目標是協助使用者集中管理日常備品、物品分類、存放位置、庫存數量、異動紀錄與低庫存通知。

系統支援 Email / Google 登入、物品新增與編輯、分類與位置管理、條碼掃描、圖片上傳、庫存異動紀錄、低庫存警示、手動寄送低庫存通知，以及每日排程寄送低庫存 Email。前端以 Nuxt UI、Tailwind CSS、i18n、Pinia、TanStack Query、Chart.js 與 vue-chartjs 建立響應式管理介面；後端使用 Nuxt Server API、Supabase Auth / PostgreSQL / Storage / RLS、Resend 與 Cloudflare Cron Worker 串接資料安全、通知流程與排程任務。

專案重點包含可追蹤的庫存異動紀錄、按使用者隔離的資料存取、低庫存通知流程、圖片與條碼處理、伺服端 API 權限控管，以及適合實際使用的後台管理 UI。

## 功能特色

- Email / Google 帳號登入
- 使用者資料隔離與 Supabase RLS 權限控管
- 大類別、小類別、位置與群組管理
- 物品新增、編輯、刪除與清單檢視
- 低庫存門檻設定與低庫存狀態顯示
- 每位使用者可自行開關每日低庫存通知
- 手動寄送目前使用者的低庫存通知
- Cloudflare Cron Worker 每日排程檢查所有啟用通知的使用者
- Resend Email 低庫存通知
- 條碼輸入、圖片條碼辨識與即時相機掃描
- 物品圖片上傳、壓縮與 Supabase Storage 儲存
- 庫存異動紀錄，記錄建立、更新、刪除與欄位變更
- 首頁儀表板顯示庫存數量、低庫存數量、近期紀錄與分類圓餅圖
- 物品清單支援列表 / 卡片檢視與 CSV 匯出
- 繁體中文 / English i18n

## 技術棧

### Frontend

- Nuxt 4
- Vue 3
- TypeScript
- Nuxt UI
- Tailwind CSS
- Pinia
- pinia-plugin-persistedstate
- TanStack Query for Vue
- @nuxtjs/i18n
- Chart.js
- vue-chartjs

### Barcode / Image

- @zxing/browser
- @zxing/library
- browser-image-compression
- Supabase Storage

### Backend / Data

- Nuxt Server API
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Supabase Service Role
- Resend
- Cloudflare Workers Cron Trigger

### Tooling

- pnpm
- ESLint
- @antfu/eslint-config
- vue-tsc
- Vitest
- Husky

## 專案結構

```txt
app/                  Nuxt app pages, layouts, components, composables, plugins
app/services/         Supabase data access services
config/               UI, query, email, barcode, image, select, log 設定
i18n/locales/         繁體中文與英文語系文字
server/api/           Nuxt server API routes
server/utils/         Server-only utilities
types/                共用 TypeScript 型別
utils/                共用純函式
supabase-schema.sql   Supabase tables, indexes, triggers, RLS policies
```

## 環境變數

請參考 `.env.example` 建立 `.env`：

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
- `SUPABASE_KEY`：Supabase anon key，供前端登入與 RLS 查詢使用
- `SUPABASE_SERVICE_ROLE_KEY`：Server API 使用的 service role key，只能放在 server 環境
- `INVENTORY_CRON_SECRET`：Nuxt API 與 Cloudflare Worker 之間的排程驗證密鑰
- `RESEND_API_KEY`：Resend API key
- `LOW_STOCK_FROM_EMAIL`：低庫存通知寄件人，例如 `Inventory <notify@example.com>`

## Supabase 設定

1. 建立 Supabase project
2. 到 SQL Editor 執行 `supabase-schema.sql`
3. 確認 RLS policies 已建立
4. 建立物品圖片使用的 Supabase Storage bucket
5. 將 Supabase URL、anon key、service role key 放入 `.env`

`supabase-schema.sql` 包含：

- `categories`
- `locations`
- `item_groups`
- `items`
- `inventory_logs`
- `user_settings`
- indexes
- `updated_at` trigger
- RLS policies

## 低庫存通知流程

低庫存通知分成手動通知與每日排程通知。

手動通知：

1. 使用者在首頁按下「發送低庫存通知」
2. Nuxt Server API 透過目前登入使用者的 token 取得使用者身分
3. 查詢該使用者啟用低庫存警示且低於門檻的物品
4. 使用 Resend 寄送 Email 到該使用者信箱

每日排程通知：

1. Cloudflare Worker 由 Cron Trigger 定時執行
2. Worker 帶上 `INVENTORY_CRON_SECRET` 呼叫 Nuxt API
3. Nuxt Server API 使用 service role 查詢已開啟每日通知的使用者
4. 系統依使用者分組寄送低庫存 Email

Cloudflare Worker 專案需要設定：

```txt
INVENTORY_APP_URL=
INVENTORY_CRON_SECRET=
```

其中 `INVENTORY_CRON_SECRET` 必須與 Nuxt 專案一致。

## 本機開發

安裝依賴：

```powershell
pnpm install
```

啟動開發伺服器：

```powershell
pnpm dev
```

預設網址：

```txt
http://localhost:3000
```

## 常用指令

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 部署注意事項

- `SUPABASE_SERVICE_ROLE_KEY`、`INVENTORY_CRON_SECRET`、`RESEND_API_KEY` 必須只存在 server-side environment
- 前端只能使用 Supabase anon key，資料權限由 RLS 控制
- Resend 寄件網域需要完成 DNS 驗證
- Cloudflare Worker 的 `INVENTORY_CRON_SECRET` 必須與 Nuxt API 使用同一組值
- 若部署到 Vercel，請確認 Nuxt Server API 可正常讀取 server environment variables

## 履歷作品介紹

庫存管理系統是一個以 Nuxt 4、TypeScript、Supabase 與 Cloudflare Workers 開發的全端庫存管理專案，支援使用者登入、物品分類、條碼掃描、圖片上傳、庫存異動紀錄、低庫存警示與 Email 通知。前端使用 Nuxt UI、Tailwind CSS、i18n、Pinia、TanStack Query、Chart.js 與 ZXing 建立響應式管理介面與條碼操作流程；後端透過 Nuxt Server API、Supabase Auth / PostgreSQL / Storage / RLS、Resend 與 Cloudflare Cron Worker 實作資料權限控管、低庫存通知與每日排程任務。

專案重點包含以 RLS 隔離使用者資料、以 TanStack Query 管理 server state 與快取、記錄物品欄位層級的異動歷程、整合 Resend 寄送通知信，以及使用 Cloudflare Worker 觸發每日低庫存檢查，完整涵蓋前端介面、後端 API、資料庫設計、權限控管與排程通知流程。
