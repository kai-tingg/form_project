// =========================================================
// js/pages/vpn.js
// VPN 帳號列表頁：渲染、選取、分頁、刪除
// API：getVpnAccounts / deleteVpnAccount
// =========================================================

import { installUiScale } from "../lib/ui-scale.js";
import { requireAuth } from "../lib/auth.js";
import { installTopBar } from "../lib/top-bar.js";
import { openConfirm } from "../lib/modal.js";
import { getVpnAccounts, deleteVpnAccount } from "../api/vpn-api.js";

requireAuth();
installUiScale();
installTopBar();

const PAGE_SIZE = 9;

const state = {
  accounts: [],
  currentPage: 1,
  selectedId: null,
};

const tableHost  = document.getElementById("vpnTableHost");
const pagerLabel = document.getElementById("pagerLabel");

async function refresh() {
  state.accounts = await getVpnAccounts();

  const totalPages = Math.max(1, Math.ceil(state.accounts.length / PAGE_SIZE));
  if (state.currentPage > totalPages) state.currentPage = totalPages;

  const start = (state.currentPage - 1) * PAGE_SIZE;
  const rows = state.accounts.slice(start, start + PAGE_SIZE);

  tableHost.innerHTML = rows.length === 0
    ? `<div class="empty-text">尚無 VPN 帳號</div>`
    : renderTable(rows);

  pagerLabel.textContent = `第${state.currentPage}筆 / 共${totalPages}筆`;
}

function renderTable(rows) {
  const tbody = rows.map((v) => `
    <tr data-id="${v.id}">
      <td>${v.user}</td>
      <td>${v.name}</td>
      <td>${v.vlan}</td>
    </tr>
  `).join("");

  return `
    <table>
      <thead>
        <tr>
          <th>使用者名稱</th><th>VPN帳號名稱</th><th>VLANID</th>
        </tr>
      </thead>
      <tbody>${tbody}</tbody>
    </table>
  `;
}

tableHost.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-id]");
  if (!row) return;
  state.selectedId = row.dataset.id;
  document.querySelectorAll("tbody tr").forEach((tr) => tr.classList.remove("selected"));
  row.classList.add("selected");
});

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "home.html";
});

document.getElementById("addBtn").addEventListener("click", () => {
  window.location.href = "vpn-add.html";
});

document.getElementById("revokeBtn").addEventListener("click", () => {
  if (!state.selectedId) {
    alert("請先點選一筆 VPN 帳號");
    return;
  }
  const target = state.accounts.find((v) => String(v.id) === String(state.selectedId));
  openConfirm(
    "是否撤銷VPN帳號?",
    `帳號名稱：${target?.name ?? ""}<br>VLANID：${target?.vlan ?? ""}`,
    async () => {
      await deleteVpnAccount(state.selectedId);
      state.selectedId = null;
      await refresh();
    }
  );
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (state.currentPage > 1) {
    state.currentPage--;
    refresh();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.max(1, Math.ceil(state.accounts.length / PAGE_SIZE));
  if (state.currentPage < totalPages) {
    state.currentPage++;
    refresh();
  }
});

refresh();
