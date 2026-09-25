// =====================================================
// DATA LAYER
// Category definitions + JSON loading. Edit CATS to change categories.
// =====================================================
const $ = (s, r = document) => r.querySelector(s);
// Cover photo per category — royalty-free placeholder source, seeded so each
// category always gets the same image. Swap `cover` for licensed artwork in production.
const img = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const CATS = [
  { slug: 'anime', name: 'Anime', icon: '⛩️', desc: 'Explore legendary characters, new releases, trailers and stories.', cover: 'assets/images/anime-cover.jpg' },
  { slug: 'gaming', name: 'Gaming', icon: '🎮', desc: 'Discover games, characters, releases and gaming culture.', cover: 'assets/images/gaming.jpg' },
  { slug: 'movies', name: 'Movies', icon: '🎬', desc: 'Blockbusters, indie gems and cinematic universes.', cover: 'assets/images/movies_category_hd.jpg' },
  { slug: 'tvshows', name: 'TV Shows', icon: '📺', desc: 'Series, seasons and stories worth binging.', cover: 'assets/images/tv show.jpg' },
  { slug: 'kpop', name: 'K-Pop', icon: '🎤', desc: 'Idols, comebacks, concerts and fandom culture.', cover: 'assets/images/kpop.jpg' },
  { slug: 'comics', name: 'Comics', icon: '🦸', desc: 'Heroes, villains and legendary story arcs.',cover: 'assets/images/cosmic2.svg' },
  { slug: 'manga', name: 'Manga', icon: '📖', desc: 'Chapters, artists and the pages that hook you.', cover: 'assets/images/manga-cover.jpg' }
];
const FV = { items: [], failed: 0 };
const catBy = n => CATS.find(c => c.name === n || c.slug === n);

// Each dataset loads independently so one failure never breaks the site.
async function loadContent() {
  const files = [...CATS.map(c => c.slug), 'characters', 'events', 'merchandise'];
  const res = await Promise.allSettled(files.map(f => fetch(`data/${f}.json`).then(r => { if (!r.ok) throw new Error(f); return r.json(); })));
  FV.items = res.flatMap(r => r.status === 'fulfilled' ? r.value : []);
  FV.failed = res.filter(r => r.status === 'rejected').length;
}
