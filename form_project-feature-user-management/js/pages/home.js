// =========================================================
// js/pages/home.js
// 首頁進入點：純導頁，不打 API
// =========================================================

import { installUiScale } from "../lib/ui-scale.js";
import { requireAuth, logout } from "../lib/auth.js";
import { installTopBar } from "../lib/top-bar.js";

requireAuth();
installUiScale();
installTopBar();

// 用事件委派處理首頁 menu-item 點擊
document.querySelector(".home-grid").addEventListener("click", (event) => {
  const item = event.target.closest("[data-target]");
  if (!item) return;

  const target = item.dataset.target;
  if (target === "logout") {
    logout();
  } else {
    window.location.href = target;
  }
});
