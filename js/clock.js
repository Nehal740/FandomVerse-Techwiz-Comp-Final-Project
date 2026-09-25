// =====================================================
// REAL-TIME CLOCK — updates every second
// =====================================================
function updateClock() {
  const d = new Date(), f = (o) => d.toLocaleDateString('en-US', o).toUpperCase();
  $('#clock').textContent = `${f({ weekday: 'short' })} • ${f({ month: 'short' })} ${d.getDate()} • ${d.getFullYear()}  ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
}
