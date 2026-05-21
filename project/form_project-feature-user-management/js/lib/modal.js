// =========================================================
// js/lib/modal.js
// 通用「是 / 否」確認視窗
// ---------------------------------------------------------
// 各頁面在 HTML 內放一個 <div id="confirmModal" class="modal-mask hidden">
// 結構即可（樣板見 home.html 等）。
// =========================================================

let modalEl, titleEl, textEl, yesBtn, noBtn;
let onConfirm = null;

function ensureCached() {
  if (modalEl) return;
  modalEl = document.getElementById("confirmModal");
  titleEl = document.getElementById("confirmTitle");
  textEl  = document.getElementById("confirmText");
  yesBtn  = document.getElementById("yesBtn");
  noBtn   = document.getElementById("noBtn");

  yesBtn.addEventListener("click", async () => {
    // 先把 callback 保留下來再 close()，因為 close() 會把 onConfirm 清空
    const callback = onConfirm;
    close();
    if (callback) await callback();
  });
  noBtn.addEventListener("click", close);
}

function close() {
  modalEl.classList.add("hidden");
  onConfirm = null;
}

/**
 * 顯示確認視窗。
 * @param {string} title - 主標題（允許 HTML）
 * @param {string} text  - 內文（允許 HTML，可換行 <br>）
 * @param {() => (void | Promise<void>)} callback - 按「是」時執行
 */
export function openConfirm(title, text, callback) {
  ensureCached();
  titleEl.innerHTML = title;
  textEl.innerHTML  = text;
  onConfirm = callback;
  modalEl.classList.remove("hidden");
}
