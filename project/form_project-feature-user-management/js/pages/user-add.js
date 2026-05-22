// =========================================================
// js/pages/user-add.js
// 新增使用者頁：表單送出 → createUser → 確認 → 導回 users
// API：createUser
// =========================================================

import { installUiScale } from "../lib/ui-scale.js";
import { requireAuth } from "../lib/auth.js";
import { installTopBar } from "../lib/top-bar.js";
import { openConfirm } from "../lib/modal.js";
import { createUser } from "../api/users-api.js";

requireAuth();
installUiScale();
installTopBar();

// 預設值：當欄位空白時填的佔位字串
const PLACEHOLDER = {
  name: "XXX",
  studentId: "XXXXXXXX",
  phone: "XXXXXX",
  email: "XXXXXX@SSSSSS",
  vpn: "vpn001",
};

function readField(id, fallback) {
  return document.getElementById(id).value.trim() || fallback;
}

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "users.html";
});

document.getElementById("submitBtn").addEventListener("click", () => {
  const payload = {
    name:      readField("newName",      PLACEHOLDER.name),
    studentId: readField("newStudentId", PLACEHOLDER.studentId),
    phone:     readField("newPhone",     PLACEHOLDER.phone),
    email:     readField("newEmail",     PLACEHOLDER.email),
    vpn:       readField("newVpn",       PLACEHOLDER.vpn),
  };

  const summary = `
    名稱：${payload.name}<br>
    學號：${payload.studentId}<br>
    電話號碼：${payload.phone}<br>
    電子郵件：${payload.email}
  `;

  openConfirm("是否新增使用者？", summary, async () => {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;

    try {
      await createUser(payload);
      window.location.href = "users.html";
    } catch (error) {
      submitBtn.disabled = false;
      alert(`新增使用者失敗：${error.message || "未知錯誤"}`);
    }
  });
});
