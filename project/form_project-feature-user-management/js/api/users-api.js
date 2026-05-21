// =========================================================
// js/api/users-api.js
// 使用者管理 API：查列表 / 查詳情 / 新增 / 撤銷
// ---------------------------------------------------------
// 沒後端時用 sessionStorage 當假資料庫；正式接後端時改 mock 開關。
// =========================================================

import { apiRequest, USE_MOCK_API } from "./client.js";

const MOCK_KEY = "uniaccess_mock_users";

/* ---- mock 假資料庫存取 ---- */
function readMock() {
  const raw = sessionStorage.getItem(MOCK_KEY);
  return raw ? JSON.parse(raw) : [];
}
function writeMock(list) {
  sessionStorage.setItem(MOCK_KEY, JSON.stringify(list));
}

/** 取得使用者列表 */
export async function getUsers() {
  if (USE_MOCK_API) return readMock();
  return apiRequest("/api/users", { method: "GET" });
}

/** 依 id 取得單一使用者 */
export async function getUser(id) {
  if (USE_MOCK_API) {
    return readMock().find((u) => String(u.id) === String(id));
  }
  return apiRequest(`/api/users/${id}`, { method: "GET" });
}

/** 新增使用者 */
export async function createUser(userData) {
  if (USE_MOCK_API) {
    const users = readMock();
    const newUser = { id: Date.now(), ...userData };
    users.push(newUser);
    writeMock(users);
    return newUser;
  }
  return apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/** 撤銷（刪除）使用者 */
export async function revokeUser(id) {
  if (USE_MOCK_API) {
    writeMock(readMock().filter((u) => String(u.id) !== String(id)));
    return { success: true };
  }
  return apiRequest(`/api/users/${id}`, { method: "DELETE" });
}
