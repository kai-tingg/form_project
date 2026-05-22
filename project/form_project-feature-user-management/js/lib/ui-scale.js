// =========================================================
// js/lib/ui-scale.js
// 縮放整個畫布
// ---------------------------------------------------------
// 設計尺寸固定 1366x768。
// 桌機版用 X/Y 分別縮放，讓舞台貼合瀏覽器比例；
// 窄版響應式 CSS 會取消 transform，改用流式排版。
// =========================================================

const DESIGN_WIDTH = 1366;
const DESIGN_HEIGHT = 768;

function applyScale() {
  const scaleX = window.innerWidth / DESIGN_WIDTH;
  const scaleY = window.innerHeight / DESIGN_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  document.documentElement.style.setProperty("--ui-scale", scale);
  document.documentElement.style.setProperty("--ui-scale-x", scaleX);
  document.documentElement.style.setProperty("--ui-scale-y", scaleY);
}

/** 在頁面進站時呼叫一次即可：自動安裝 resize listener。 */
export function installUiScale() {
  applyScale();
  window.addEventListener("resize", applyScale);
}
