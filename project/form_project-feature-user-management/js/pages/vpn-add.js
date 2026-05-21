// =========================================================
// js/pages/vpn-add.js
// 新增 VPN 帳號頁：表單送出 → createVpnAccount → 確認 → 導回 vpn
// API：createVpnAccount
// =========================================================

import { installUiScale } from "../lib/ui-scale.js";
import { requireAuth } from "../lib/auth.js";
import { installTopBar } from "../lib/top-bar.js";
import { openConfirm } from "../lib/modal.js";
import { createVpnAccount } from "../api/vpn-api.js";

requireAuth();
installUiScale();
installTopBar();

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "vpn.html";
});

document.getElementById("submitBtn").addEventListener("click", () => {
  const user = document.getElementById("inUser").value.trim();
  const name = document.getElementById("inName").value.trim();
  const vlan = document.getElementById("inVlan").value.trim();

  if (!user || !name || !vlan) {
    alert("請填寫完整資訊");
    return;
  }

  openConfirm(
    "是否新增VPN帳號?",
    `使用者名稱：${user}<br>帳號名稱：${name}<br>VLANID：${vlan}`,
    async () => {
      await createVpnAccount({ user, name, vlan });
      window.location.href = "vpn.html";
    }
  );
});
