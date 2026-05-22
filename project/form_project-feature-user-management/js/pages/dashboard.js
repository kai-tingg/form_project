// Animated fake dashboard metrics for home.html.

const monitorState = {
  vlan10: { value: 842 },
  vlan20: { value: 1240 },
  resources: {
    cpu: 64,
    memory: 72,
    storage: 41,
  },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomStep(range) {
  return (Math.random() - 0.5) * range;
}

function formatTraffic(value, unit) {
  if (unit === "Gbps") return (value / 1000).toFixed(2);
  return Math.round(value).toString();
}

function updateMonitorCard(card) {
  const key = card.dataset.monitor;
  const min = Number(card.dataset.min);
  const max = Number(card.dataset.max);
  const unit = card.dataset.unit;
  const state = monitorState[key];
  if (!state) return;

  state.value = clamp(state.value + randomStep((max - min) * 0.16), min, max);
  const ratio = (state.value - min) / (max - min);
  const angle = -90 + ratio * 180;
  const inbound = state.value * (0.55 + Math.random() * 0.14);
  const outbound = state.value - inbound;
  const packets = (state.value / 42) * (0.82 + Math.random() * 0.24);

  card.style.setProperty("--gauge-angle", `${angle.toFixed(1)}deg`);
  card.querySelector(".gauge-value strong").textContent = formatTraffic(state.value, unit);
  card.querySelector(".gauge-value span").textContent = unit;
  card.querySelector('[data-field="inbound"]').textContent = `${Math.round(inbound)} Mbps`;
  card.querySelector('[data-field="outbound"]').textContent = `${Math.round(outbound)} Mbps`;
  card.querySelector('[data-field="packets"]').textContent = `${packets.toFixed(1)}k/s`;
}

function updateResource(name, range) {
  const next = clamp(monitorState.resources[name] + randomStep(range), 18, 94);
  monitorState.resources[name] = next;

  const bar = document.querySelector(`[data-resource="${name}"]`);
  const label = document.querySelector(`[data-resource-value="${name}"]`);
  if (!bar || !label) return;

  bar.style.width = `${next.toFixed(0)}%`;
  label.textContent = `${next.toFixed(0)}%`;
}

function updateDashboard() {
  document.querySelectorAll("[data-monitor]").forEach(updateMonitorCard);
  updateResource("cpu", 10);
  updateResource("memory", 6);
  updateResource("storage", 2);
}

updateDashboard();
window.setInterval(updateDashboard, 1600);
