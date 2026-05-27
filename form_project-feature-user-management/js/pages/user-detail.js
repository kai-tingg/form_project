// =========================================================
// js/pages/user-detail.js
// 使用者詳情頁：依 URL ?id= 取單筆資料並渲染
// API：getUser
// =========================================================

import { installUiScale } from "../lib/ui-scale.js";
import { requireAuth } from "../lib/auth.js";
import { installTopBar } from "../lib/top-bar.js";
import { getUser } from "../api/users-api.js";

requireAuth();
installUiScale();
installTopBar();

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "users.html";
});

(async function init() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    window.location.href = "users.html";
    return;
  }

  const user = await getUser(id);
  if (!user) {
    window.location.href = "users.html";
    return;
  }

  document.getElementById("detailText").innerHTML = `
    使用者名稱：${user.name}<br>
    學號：${user.studentId}<br>
    電話號碼：${user.phone}<br>
    電子郵件：${user.email}<br>
    ：<br>：<br>：<br>
    VPN帳號：${user.vpn}
  `;
})();
