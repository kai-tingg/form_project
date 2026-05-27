// =========================================================
// js/pages/users.js
// 使用者列表頁：渲染、選取、分頁、撤銷
// API：getUsers / revokeUser
// =========================================================

import { installUiScale } from "../lib/ui-scale.js";
import { requireAuth } from "../lib/auth.js";
import { installTopBar } from "../lib/top-bar.js";
import { openConfirm } from "../lib/modal.js";
import { getUsers, revokeUser } from "../api/users-api.js";

requireAuth();
installUiScale();
installTopBar();

const PAGE_SIZE = 9;

const state = {
  users: [],
  currentPage: 1,
  selectedId: null,
};

const tableHost  = document.getElementById("userTableHost");
const pagerLabel = document.getElementById("pagerLabel");

/* ---- 渲染 ---- */
async function refresh() {
  state.users = await getUsers();

  const totalPages = Math.max(1, Math.ceil(state.users.length / PAGE_SIZE));
  if (state.currentPage > totalPages) state.currentPage = totalPages;

  const start = (state.currentPage - 1) * PAGE_SIZE;
  const pageUsers = state.users.slice(start, start + PAGE_SIZE);

  tableHost.innerHTML = pageUsers.length === 0
    ? `<div class="empty-text">尚無使用者</div>`
    : renderTable(pageUsers);

  pagerLabel.textContent = `第${state.currentPage}筆 / 共${totalPages}筆`;
}

function renderTable(rows) {
  const tbody = rows.map((u) => `
    <tr data-id="${u.id}">
      <td>👤 ${u.name}</td>
      <td>${u.studentId}</td>
      <td>${u.email}</td>
      <td><span class="info-btn" data-info="${u.id}">i</span></td>
    </tr>
  `).join("");

  return `
    <table>
      <thead>
        <tr>
          <th>使用者名稱</th><th>學號</th><th>電子郵件</th><th></th>
        </tr>
      </thead>
      <tbody>${tbody}</tbody>
    </table>
  `;
}

/* ---- 事件：表格列選取 / 詳情按鈕 ---- */
tableHost.addEventListener("click", (event) => {
  // 詳情按鈕（i）：阻擋冒泡，直接導頁
  const infoBtn = event.target.closest("[data-info]");
  if (infoBtn) {
    event.stopPropagation();
    window.location.href = `user-detail.html?id=${infoBtn.dataset.info}`;
    return;
  }

  // 選取列
  const row = event.target.closest("tr[data-id]");
  if (!row) return;
  state.selectedId = row.dataset.id;
  document.querySelectorAll("tbody tr").forEach((tr) => tr.classList.remove("selected"));
  row.classList.add("selected");
});

/* ---- 工具列：返回 / 新增 / 撤銷 ---- */
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "home.html";
});

document.getElementById("addBtn").addEventListener("click", () => {
  window.location.href = "user-add.html";
});

document.getElementById("revokeBtn").addEventListener("click", () => {
  if (!state.selectedId) {
    alert("請先點選一位使用者");
    return;
  }
  openConfirm("是否撤銷使用者？", "", async () => {
    await revokeUser(state.selectedId);
    state.selectedId = null;
    await refresh();
  });
});

/* ---- 分頁 ---- */
document.getElementById("prevPage").addEventListener("click", () => {
  if (state.currentPage > 1) {
    state.currentPage--;
    refresh();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.max(1, Math.ceil(state.users.length / PAGE_SIZE));
  if (state.currentPage < totalPages) {
    state.currentPage++;
    refresh();
  }
});

/* ---- 初始載入 ---- */
refresh();
