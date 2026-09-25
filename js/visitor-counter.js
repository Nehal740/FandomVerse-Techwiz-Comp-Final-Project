// =====================================================
// VISITOR COUNTER (simulated / demo — LocalStorage)
// =====================================================
function updateVisitorCounter() {
  let n = +localStorage.getItem('fv_visitors') || 1248;
  if (!sessionStorage.getItem('fv_seen')) { n += 1 + Math.floor(Math.random() * 4); sessionStorage.setItem('fv_seen', '1'); localStorage.setItem('fv_visitors', n); }
  $('#visitors').textContent = n.toLocaleString();
}
