// =========================================================
// js/api/client.js
// 通用 HTTP 客戶端：fetch 包裝 + token 自動帶入 + 401 自動登出
// ---------------------------------------------------------
// 各個 *-api.js 模組透過此檔送請求，避免重複寫 fetch 樣板。
// USE_MOCK_API 為 true 時 *-api.js 會走假資料；本檔不關心 mock。
// =========================================================

import { getToken, clearAuth } from "../lib/auth.js";

export const API_BASE_URL = "http://localhost:3000";
export const USE_MOCK_API = true;

/**
 * 對後端發送 JSON 請求。
 * @param {string} path - 相對路徑，例如 "/api/users"
 * @param {RequestInit} [options]
 * @returns {Promise<any>} - 解析後的 JSON
 */
export async function apiRequest(path, options = {}) {
  const token = getToken();

  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  // 401：token 過期 → 清除登入狀態並讓呼叫端決定要不要導頁
  if (response.status === 401) {
    clearAuth();
    throw new Error("登入已過期");
  }

  if (!response.ok) {
    throw new Error(`API 發生錯誤：${response.status}`);
  }

  return response.json();
}
