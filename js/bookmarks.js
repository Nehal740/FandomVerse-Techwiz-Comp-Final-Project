// =====================================================
// BOOKMARK SYSTEM
// Uses LocalStorage. Personal notes use SessionStorage.
// Modify bookmark behaviour here
// =====================================================
const BM_KEY = 'fv_bookmarks', NOTES_KEY = 'fv_notes';
const loadBookmarks = () => { try { return JSON.parse(localStorage.getItem(BM_KEY)) || []; } catch { return []; } };
function toggleBookmark(id) {
  let b = loadBookmarks(); const had = b.includes(id);
  b = had ? b.filter(x => x !== id) : [...b, id];
  localStorage.setItem(BM_KEY, JSON.stringify(b));
  toast(had ? 'Removed from bookmarks.' : 'Added to bookmarks.'); updateBadges();
  return !had;
}
function exportBookmarks() {
  const ids = loadBookmarks();
  const data = { exported: new Date().toISOString(), notes: sessionStorage.getItem(NOTES_KEY) || '', items: FV.items.filter(i => ids.includes(i.id)).map(({ id, title, category, type }) => ({ id, title, category, type })) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'fandomverse-bookmarks.json'; a.click(); toast('Bookmarks exported.');
}
