// =====================================================
// FILTERS & SORTING
// Modify filter/sort behaviour here
// =====================================================
const TYPES = ['article', 'character', 'trailer', 'event', 'merchandise'];
function filterContent(list, { cat, type }) {
  return list.filter(i => (!cat || i.category === cat) && (!type || i.type === type));
}
function sortContent(list, mode) {
  const s = [...list];
  if (mode === 'az') s.sort((a, b) => a.title.localeCompare(b.title));
  else if (mode === 'new') s.sort((a, b) => b.date.localeCompare(a.date));
  else if (mode === 'pop') s.sort((a, b) => b.popularity - a.popularity);
  else if (mode === 'feat') s.sort((a, b) => b.featured - a.featured || b.popularity - a.popularity);
  return s;
}
