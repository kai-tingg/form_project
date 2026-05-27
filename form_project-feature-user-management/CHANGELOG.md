# 修改日誌

## 2026-05-21 — 前端重構為多頁架構（MPA）

> 這次改動規模較大，請組員花 5 分鐘看完再 pull。

### TL;DR

- **入口頁從 `index2.html` 改為 `login.html`**
- **必須用 HTTP server 開啟**，不能再雙擊 HTML（瀏覽器擋 ES Modules over `file://`）
- 整個專案拆成 7 個獨立 HTML 頁面，每頁負責自己的 API 呼叫
- CSS 重寫為「設計變數 + 共用元件 + 頁面專屬」三層
- JS 改用 ES Modules，全域變數與 inline `onclick` 全數移除

---

### 怎麼跑起來測試

舊版可以直接雙擊開 HTML，**新版不行**（ES Modules 在瀏覽器只接 http/https）。
在專案根目錄起本地 server：

```powershell
cd "C:\Users\Ronny\Desktop\新增資料夾\form_project\project\form_project-feature-user-management"
python -m http.server 8000
```

然後瀏覽器打開 <http://localhost:8000/login.html>，帳密 `admin` / `123456`。

---

### 新檔案結構

```text
form_project-feature-user-management/
├── login.html              ← 登入（入口）
├── home.html               ← 登入後首頁
├── users.html              ← 使用者列表（含撤銷）
├── user-add.html           ← 新增使用者
├── user-detail.html        ← 使用者詳情
├── vpn.html                ← VPN 列表（含撤銷）
├── vpn-add.html            ← 新增 VPN
├── css/
│   ├── theme.css           ← 設計變數（顏色、間距、圓角、動畫）
│   ├── shared.css          ← 跨頁共用元件
│   ├── login.css           ← 登入頁專屬
│   ├── home.css            ← 首頁專屬
│   ├── users.css           ← 使用者相關頁面共用
│   └── vpn.css             ← VPN 相關頁面共用
└── js/
    ├── api/
    │   ├── client.js       ← fetch 包裝、token 自動帶入、401 處理
    │   ├── auth-api.js     ← 登入 API
    │   ├── users-api.js    ← 使用者 CRUD API
    │   └── vpn-api.js      ← VPN 帳號 CRUD API
    ├── lib/
    │   ├── auth.js         ← 登入狀態管理、頁面守衛 requireAuth()
    │   ├── ui-scale.js     ← 畫布等比縮放
    │   ├── modal.js        ← 確認視窗
    │   └── top-bar.js      ← 上方列互動
    └── pages/
        ├── login.js
        ├── home.js
        ├── users.js
        ├── user-add.js
        ├── user-detail.js
        ├── vpn.js
        └── vpn-add.js
```

### 刪除的舊檔

| 舊檔 | 替代為 |
|---|---|
| `index2.html` | `login.html` + `home.html` + `users.html` + `user-add.html` + `user-detail.html` |
| `indexB.html.html` | `vpn.html` + `vpn-add.html` |
| `css/styles.css` (1354 行 + 大量 `!important`) | `theme.css` + `shared.css` + `login.css` + `home.css` + `users.css` |
| `styleB.css` | `vpn.css` + 共用 `shared.css` |
| `js/app.js` (430 行 SPA 路由) | `js/pages/*` 七個進入點 |
| `js/api.js` | `js/api/` 資料夾，按資源分檔 |
| `js/scriptB.js` | `js/pages/vpn.js` + `js/pages/vpn-add.js` |

---

### 後端串接點

切換 mock / 真後端**只動一個檔**：`js/api/client.js`

```js
const API_BASE_URL = "http://localhost:3000";  // 後端網址
const USE_MOCK_API = true;                     // false = 走真後端
```

各個 `*-api.js` 完全不用動。Mock 模式用 `sessionStorage` 當假資料庫，關掉分頁就清空。

預定的後端 endpoint：

| 模組 | Method | 路徑 |
|---|---|---|
| 登入 | POST | `/api/auth/login` |
| 使用者列表 | GET | `/api/users` |
| 使用者詳情 | GET | `/api/users/:id` |
| 新增使用者 | POST | `/api/users` |
| 撤銷使用者 | DELETE | `/api/users/:id` |
| VPN 列表 | GET | `/api/vpn-accounts` |
| 新增 VPN | POST | `/api/vpn-accounts` |
| 刪除 VPN | DELETE | `/api/vpn-accounts/:id` |

---

### 美術統一

- 兩頁原本用不同色票、不同字級、不同畫布尺寸（1366×768 vs 1920×1080）
- 現在統一為 1366×768，色票全部走 `theme.css` 的 CSS variables
- 共用同一套：top-bar、按鈕（`.btn-pill` + `.btn-green` / `.btn-red`）、modal、左側斜角 tabs、hover/active 動畫

要改色系？**只改 `css/theme.css`**，全站跟著變。

---

### Bug 修正

1. **登入按鈕無作用** —— 舊版 `app.js` 第 5 行有 `import "scriptB.js"`，但 `app.js` 是用非 module 載入，整個檔案 parse 失敗。重構時直接拿掉。
2. **VPN 帳號管理進不去** —— 舊版用 inline `onclick="renderList()"` 呼叫 ES module 的匯出函式，找不到全域 `renderList`。新版用獨立頁面導頁，無此問題。
3. **介面 hover 動畫遺失** —— `7c99c6b` 加的動畫在「整合版 V1」commit 被覆蓋。重構時搬到 `shared.css` 並重新整理。
4. **確認視窗按「是」沒反應** —— 內部 `close()` 在執行 callback 前就清空了 `onConfirm`，影響所有用到確認的功能（新增/撤銷使用者、新增/撤銷 VPN）。已修正。
5. **`scriptB.js` 在 `index2.html` 啟動時 crash** —— 舊版同時把 VPN 頁的腳本載入主應用，因為主應用沒有 VPN 頁需要的 DOM 元素，`null.style.transform` 立刻噴錯。重構後兩頁徹底分離。

---

### Clean Code 整理

- 全域變數移除（用 module-level `state` 物件封閉在各自頁面內）
- inline `onclick` 全數移除，改 `addEventListener` + event delegation
- API mock 邏輯與業務邏輯分離（mock 由 `client.js` 統一控制）
- 命名一致：動詞-名詞，無 `B`/`X`/`btn-primary` 之類無意義後綴
- 函式單一職責，magic number 抽成具名常數（如 `PAGE_SIZE`、`PLACEHOLDER`）
- 每支 JS 檔頭都有用途註解，section 之間有分隔註解

---

### UI 細節

- 點擊任何輸入框時會反白（淺灰底 + 深字），跨全站一致
- 表格列 hover 變灰、選取變紅
- 按鈕 hover 微浮起、按下微下壓，遵循 0.18s ease 過渡
