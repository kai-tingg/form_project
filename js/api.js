// ===============================
// UniAccess API 對接區
// 後端完成後，主要改這個檔案
// ===============================

// 後端網址，之後依後端工程師提供修改
const API_BASE_URL = "http://localhost:3000";

// 現在還沒有後端，所以先用 mock 模式
// 後端完成後改成 false
const USE_MOCK_API = true;

// 假資料存在 sessionStorage，關掉分頁後就會消失
const MOCK_USERS_KEY = "uniaccess_mock_users";

function getMockUsers() {
  const raw = sessionStorage.getItem(MOCK_USERS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

function saveMockUsers(users) {
  sessionStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function getToken() {
  return sessionStorage.getItem("uniaccess_token");
}

async function apiRequest(path, options = {}) {
  const token = getToken();

  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {})
    }
  });

  if (response.status === 401) {
    sessionStorage.removeItem("uniaccess_token");
    sessionStorage.removeItem("uniaccess_login");
    throw new Error("登入已過期");
  }

  if (!response.ok) {
    throw new Error("API 發生錯誤：" + response.status);
  }

  return response.json();
}

// 登入 API
async function loginApi(account, password) {
  if (USE_MOCK_API) {
    if (account === "admin" && password === "123456") {
      return {
        token: "mock-jwt-token",
        user: {
          id: 1,
          name: "管理員"
        }
      };
    }

    throw new Error("帳號或密碼錯誤");
  }

  // 真後端版本：POST /api/auth/login
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      account,
      password
    })
  });
}

// 取得使用者列表
async function getUsersApi() {
  if (USE_MOCK_API) {
    return getMockUsers();
  }

  // 真後端版本：GET /api/users
  return apiRequest("/api/users", {
    method: "GET"
  });
}

// 新增使用者
async function createUserApi(userData) {
  if (USE_MOCK_API) {
    const users = getMockUsers();

    const newUser = {
      id: Date.now(),
      ...userData
    };

    users.push(newUser);
    saveMockUsers(users);

    return newUser;
  }

  // 真後端版本：POST /api/users
  return apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(userData)
  });
}

// 撤銷 / 刪除使用者
async function revokeUserApi(userId) {
  if (USE_MOCK_API) {
    let users = getMockUsers();
    users = users.filter(user => String(user.id) !== String(userId));
    saveMockUsers(users);
    return { success: true };
  }

  // 真後端版本：DELETE /api/users/:id
  return apiRequest(`/api/users/${userId}`, {
    method: "DELETE"
  });
}