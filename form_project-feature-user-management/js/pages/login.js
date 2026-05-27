// =========================================================
// js/pages/login.js
// 登入頁進入點：表單送出 → 呼叫 auth-api → 寫狀態 → 導頁
// =========================================================

import { installUiScale } from "../lib/ui-scale.js";
import { setAuth, isLoggedIn } from "../lib/auth.js";
import { login } from "../api/auth-api.js";

installUiScale();

// 若已登入就直接導到首頁（避免重複登入）
if (isLoggedIn()) {
  window.location.href = "home.html";
}

const form     = document.getElementById("loginForm");
const errorBox = document.getElementById("loginError");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const account  = document.getElementById("account").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const { token } = await login(account, password);
    setAuth(token);
    window.location.href = "home.html";
  } catch {
    errorBox.classList.remove("hidden");
  }
});
