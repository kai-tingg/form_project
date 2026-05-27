// =========================================================
// js/api/vpn-api.js
// VPN 帳號管理 API：查列表 / 新增 / 刪除
// =========================================================

import { apiRequest, USE_MOCK_API } from "./client.js";

const MOCK_KEY = "uniaccess_mock_vpn";
const DEFAULT_SEED = [
  { id: 1, user: "Admin", name: "VPN_Default", vlan: "08001234" },
];

function readMock() {
  const raw = sessionStorage.getItem(MOCK_KEY);
  if (raw) return JSON.parse(raw);
  // 首次讀取時播種一筆預設帳號
  sessionStorage.setItem(MOCK_KEY, JSON.stringify(DEFAULT_SEED));
  return [...DEFAULT_SEED];
}
function writeMock(list) {
  sessionStorage.setItem(MOCK_KEY, JSON.stringify(list));
}

/** 取得 VPN 帳號列表 */
export async function getVpnAccounts() {
  if (USE_MOCK_API) return readMock();
  return apiRequest("/api/vpn-accounts", { method: "GET" });
}

/** 新增 VPN 帳號 */
export async function createVpnAccount(data) {
  if (USE_MOCK_API) {
    const list = readMock();
    const newItem = { id: Date.now(), ...data };
    list.push(newItem);
    writeMock(list);
    return newItem;
  }
  return apiRequest("/api/vpn-accounts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** 刪除 VPN 帳號 */
export async function deleteVpnAccount(id) {
  if (USE_MOCK_API) {
    writeMock(readMock().filter((v) => String(v.id) !== String(id)));
    return { success: true };
  }
  return apiRequest(`/api/vpn-accounts/${id}`, { method: "DELETE" });
}
