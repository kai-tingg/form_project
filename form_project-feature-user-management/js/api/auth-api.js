// =========================================================
// js/api/auth-api.js
// 認證相關 API：登入
// =========================================================

import { apiRequest, USE_MOCK_API } from "./client.js";

const MOCK_CREDENTIALS = {
  account: "admin",
  password: "123456",
};

/**
 * 嘗試登入。
 * @returns {Promise<{token: string, user: {id: number, name: string}}>}
 * @throws 帳號或密碼錯誤時 throw Error
 */
export async function login(account, password) {
  if (USE_MOCK_API) {
    if (account === MOCK_CREDENTIALS.account && password === MOCK_CREDENTIALS.password) {
      return {
        token: "mock-jwt-token",
        user: { id: 1, name: "管理員" },
      };
    }
    throw new Error("帳號或密碼錯誤");
  }

  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ account, password }),
  });
}
