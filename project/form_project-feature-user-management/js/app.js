// ===============================
// 鎖定 UI 比例：不同電腦等比例縮放
// ===============================

import "scriptB.js";

function setUiScale() {
  const DESIGN_WIDTH = 1366;
  const DESIGN_HEIGHT = 768;

  const scale = Math.min(
    window.innerWidth / DESIGN_WIDTH,
    window.innerHeight / DESIGN_HEIGHT
  );

  document.documentElement.style.setProperty("--ui-scale", scale);
}

window.addEventListener("resize", setUiScale);
setUiScale();

// ===============================
// UniAccess 前端操作邏輯
// ===============================

const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");
const pageContent = document.getElementById("pageContent");
const leftTabs = document.getElementById("leftTabs");
const profileMenu = document.getElementById("profileMenu");

const confirmModal = document.getElementById("confirmModal");
const confirmTitle = document.getElementById("confirmTitle");
const confirmText = document.getElementById("confirmText");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

let modalCallback = null;
let selectedUserId = null;
let currentPage = 1;
let users = [];

const pageSize = 9;

// ===============================
// 登入狀態
// 用 sessionStorage：關掉分頁後會重新登入
// ===============================

function checkLogin() {
  if (sessionStorage.getItem("uniaccess_login") === "yes") {
    showApp();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginPage.classList.remove("hidden");
  appPage.classList.add("hidden");
}

function showApp() {
  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");
  renderHome();
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const account = document.getElementById("account").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const result = await loginApi(account, password);

    sessionStorage.setItem("uniaccess_login", "yes");
    sessionStorage.setItem("uniaccess_token", result.token);

    document.getElementById("loginError").classList.add("hidden");
    showApp();
  } catch (error) {
    document.getElementById("loginError").classList.remove("hidden");
  }
});

function logout() {
  sessionStorage.removeItem("uniaccess_login");
  sessionStorage.removeItem("uniaccess_token");
  profileMenu.classList.add("hidden");
  showLogin();
}

// ===============================
// 上方按鈕
// ===============================

document.getElementById("homeBtn").addEventListener("click", renderHome);

document.getElementById("profileBtn").addEventListener("click", function () {
  profileMenu.classList.toggle("hidden");
});

document.getElementById("logoutMenuBtn").addEventListener("click", logout);

// ===============================
// 左側斜角頁籤
// ===============================

function renderTabs(activeText = "") {
  const active = activeText
    ? `<div class="tab-piece active"></div>`
    : "";

  const normalCount = activeText ? 10 : 11;

  const normal = Array.from(
    { length: normalCount },
    () => `<div class="tab-piece"></div>`
  ).join("");

  leftTabs.innerHTML = active + normal;
}

// ===============================
// 首頁
// ===============================

function renderHome() {
  renderTabs();
  profileMenu.classList.add("hidden");

  pageContent.innerHTML = `
    <div class="home-grid">
      <div class="home-box user-box">
        使用者相關
        <p onclick="renderUsers()" class="user-menu-item">
          <img src="images/icons/user-list.png" class="menu-icon-img" alt="">
          使用者列表
        </p>
      </div>

      <div class="home-right">
        <div class="home-box personal-box">
          個人
          <p>
            <img src="images/icons/settings.png" class="menu-icon-img" alt="">
            設定
          </p>
          <p onclick="logout()">
            <img src="images/icons/logout.png" class="menu-icon-img" alt="">
            登出
          </p>
        </div>

        <div class="home-box other-box">
          其他
          <p onclick="renderList()" class="vpn-menu-item">
            <img src="images/icons/vpn-manage.png" class="menu-icon-img" alt="">
            VPN帳號管理
          </p>
        </div>
      </div>
    </div>
  `;
}

// ===============================
// 使用者列表
// ===============================

async function renderUsers() {
  renderTabs("使用者列表");
  selectedUserId = null;

  users = await getUsersApi();

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * pageSize;
  const pageUsers = users.slice(start, start + pageSize);

  let bodyHtml = "";

  if (pageUsers.length === 0) {
    bodyHtml = `<div class="empty-text">尚無使用者</div>`;
  } else {
    bodyHtml = `
      <table>
        <thead>
          <tr>
            <th>使用者名稱</th>
            <th>學號</th>
            <th>電子郵件</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          ${pageUsers.map(user => `
            <tr id="user-row-${user.id}" onclick="selectUser('${user.id}')">
              <td>👤 ${user.name}</td>
              <td>${user.studentId}</td>
              <td>${user.email}</td>
              <td>
                <span class="info-btn" onclick="event.stopPropagation(); renderUserDetail('${user.id}')">i</span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  pageContent.innerHTML = `
    <div class="page-toolbar">
      <button class="back-btn" onclick="renderHome()">返回</button>
      <button class="pill-btn pill-green" onclick="renderAddUser()">☁ 新增</button>
      <button class="pill-btn pill-red" onclick="askRevokeUser()">☁ 撤銷</button>
    </div>

    ${bodyHtml}

    <div class="pager">
      <span onclick="prevPage()">◀◀</span>
      第${currentPage}筆 / 共${totalPages}筆
      <span onclick="nextPage()">▶▶</span>
    </div>
  `;
}

function selectUser(id) {
  selectedUserId = id;

  document.querySelectorAll("tbody tr").forEach(row => {
    row.classList.remove("selected");
  });

  const row = document.getElementById("user-row-" + id);

  if (row) {
    row.classList.add("selected");
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderUsers();
  }
}

function nextPage() {
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  if (currentPage < totalPages) {
    currentPage++;
    renderUsers();
  }
}

// ===============================
// 新增使用者
// ===============================

function renderAddUser() {
  renderTabs();
  pageContent.innerHTML = `
    <div class="page-toolbar">
      <button class="back-btn" onclick="renderUsers()">返回</button>
      <button class="pill-btn pill-green" onclick="askAddUser()">確認新增</button>
    </div>

    <div class="form-title">新增使用者</div>

    <div class="form-wrap">
      <div class="form-grid">
        <div>
          <div class="field">
            使用者名稱：
            <input id="newName" />
          </div>

          <div class="field">
            學號：
            <input id="newStudentId" />
          </div>

          <div class="field">
            電話號碼：
            <input id="newPhone" />
          </div>
        </div>

        <div>
          <div class="field">
            電子郵件：
            <input id="newEmail" />
          </div>

          <div class="field">
            VPN帳號：
            <input id="newVpn" />
          </div>
        </div>
      </div>
    </div>
  `;
}

function askAddUser() {
  const name = document.getElementById("newName").value.trim() || "XXX";
  const studentId = document.getElementById("newStudentId").value.trim() || "XXXXXXXX";
  const phone = document.getElementById("newPhone").value.trim() || "XXXXXX";
  const email = document.getElementById("newEmail").value.trim() || "XXXXXX@SSSSSS";
  const vpn = document.getElementById("newVpn").value.trim() || "vpn001";

  openConfirm(
    "是否新增使用者？",
    `名稱：${name}<br>學號：${studentId}<br>電話號碼：${phone}<br>電子郵件：${email}`,
    async function () {
      await createUserApi({
        name,
        studentId,
        phone,
        email,
        vpn
      });

      const latestUsers = await getUsersApi();
      currentPage = Math.max(1, Math.ceil(latestUsers.length / pageSize));

      renderUsers();
    }
  );
}

// ===============================
// 撤銷使用者
// ===============================

function askRevokeUser() {
  if (!selectedUserId) {
    alert("請先點選一位使用者");
    return;
  }

  openConfirm("是否撤銷使用者？", "", async function () {
    await revokeUserApi(selectedUserId);

    selectedUserId = null;
    renderUsers();
  });
}

// ===============================
// 詳細資料
// ===============================

function renderUserDetail(id) {
  renderTabs();

  const user = users.find(item => String(item.id) === String(id));

  if (!user) {
    return;
  }

  pageContent.innerHTML = `
    <div class="page-toolbar">
      <button class="back-btn" onclick="renderUsers()">返回</button>
    </div>

    <div class="detail-grid">
      <div class="detail-text">
        使用者名稱：${user.name}<br>
        學號：${user.studentId}<br>
        電話號碼：${user.phone}<br>
        電子郵件：${user.email}<br>
        ：<br>
        ：<br>
        ：<br>
        VPN帳號：${user.vpn}
      </div>

      <div class="vpn-card-grid">
        <div class="vpn-card"></div>
        <div class="vpn-card"></div>
        <div class="vpn-card"></div>
        <div class="vpn-card"></div>
        <div class="vpn-card"></div>
        <div class="vpn-card"></div>
      </div>
    </div>
  `;
}

// ===============================
// 確認視窗
// ===============================

function openConfirm(title, text, callback) {
  confirmTitle.innerHTML = title;
  confirmText.innerHTML = text;
  modalCallback = callback;
  confirmModal.classList.remove("hidden");
}

yesBtn.addEventListener("click", async function () {
  confirmModal.classList.add("hidden");

  if (modalCallback) {
    await modalCallback();
  }
});

noBtn.addEventListener("click", function () {
  confirmModal.classList.add("hidden");
});

// ===============================
// 啟動
// ===============================

checkLogin();