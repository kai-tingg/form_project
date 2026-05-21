// =========================================================
// js/lib/ui-scale.js
// 等比縮放整個畫布
// ---------------------------------------------------------
// 設計尺寸固定 1366x768，依視窗大小計算 --ui-scale，
// 由 shared.css 中的 .canvas / .login-page 套用 transform: scale()。
// =========================================================

const DESIGN_WIDTH = 1366;
const DESIGN_HEIGHT = 768;

function applyScale() {
  const scale = Math.min(
    window.innerWidth / DESIGN_WIDTH,
    window.innerHeight / DESIGN_HEIGHT
  );
  document.documentElement.style.setProperty("--ui-scale", scale);
}

/** 在頁面進站時呼叫一次即可：自動安裝 resize listener。 */
export function installUiScale() {
  applyScale();
  window.addEventListener("resize", applyScale);
}
