// Runs before page CSS so the fixed 1366x768 artwork can fill the viewport.
(function () {
  var DESIGN_WIDTH = 1366;
  var DESIGN_HEIGHT = 768;

  function applyViewportFit() {
    var root = document.documentElement;
    var scaleX = window.innerWidth / DESIGN_WIDTH;
    var scaleY = window.innerHeight / DESIGN_HEIGHT;
    var scale = Math.min(scaleX, scaleY);

    root.style.setProperty("--ui-scale", scale);
    root.style.setProperty("--ui-scale-x", scaleX);
    root.style.setProperty("--ui-scale-y", scaleY);
  }

  applyViewportFit();
  window.addEventListener("resize", applyViewportFit);
})();
