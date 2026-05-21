// =========================================================
// js/lib/auth.js
// 登入狀態管理：寫入/讀取/清除 + 頁面守衛
// ---------------------------------------------------------
// 使用 sessionStorage：分頁關閉就視同登出，安全性較高。
// =========================================================

const KEY_LOGIN = "uniaccess_login";
const KEY_TOKEN = "uniaccess_token";

/** 寫入登入狀態 */
export function setAuth(token) {
  sessionStorage.setItem(KEY_LOGIN, "yes");
  sessionStorage.setItem(KEY_TOKEN, token);
}

/** 是否已登入 */
export function isLoggedIn() {
  return sessionStorage.getItem(KEY_LOGIN) === "yes";
}

/** 取得目前 token（無則 null） */
export function getToken() {
  return sessionStorage.getItem(KEY_TOKEN);
}

/** 清除登入狀態 */
export function clearAuth() {
  sessionStorage.removeItem(KEY_LOGIN);
  sessionStorage.removeItem(KEY_TOKEN);
}

/**
 * 頁面守衛：未登入就導回 login.html。
 * 應由「登入後才能進入」的頁面在進站時呼叫。
 */
export function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

/** 登出：清狀態 + 導回登入頁 */
export function logout() {
  clearAuth();
  window.location.href = "login.html";
}
