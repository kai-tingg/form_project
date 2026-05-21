// =========================================================
// js/lib/top-bar.js
// 共用 top-bar 行為：home 鈕、個人選單、登出
// ---------------------------------------------------------
// 各頁面的 top-bar HTML 結構由 shared.css 統一樣式，
// 此處只負責把按鈕綁定行為。
// =========================================================

import { logout } from "./auth.js";

/**
 * 安裝 top-bar 互動。
 * 預期頁面有：#homeBtn / #profileBtn / #profileMenu / #logoutMenuBtn
 */
export function installTopBar() {
  const homeBtn       = document.getElementById("homeBtn");
  const profileBtn    = document.getElementById("profileBtn");
  const profileMenu   = document.getElementById("profileMenu");
  const logoutMenuBtn = document.getElementById("logoutMenuBtn");

  homeBtn?.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  profileBtn?.addEventListener("click", () => {
    profileMenu?.classList.toggle("hidden");
  });

  logoutMenuBtn?.addEventListener("click", logout);
}
