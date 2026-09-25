// =====================================================
// SEARCH FUNCTIONALITY
// Modify global search logic here
// =====================================================
function searchContent(list, q) {
  q = q.trim().toLowerCase();
  if (!q) return list;
  return list.filter(i => [i.title, i.description, i.category, i.type, ...(i.tags || [])].join(' ').toLowerCase().includes(q));
}
