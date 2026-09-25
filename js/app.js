// =====================================================
// APP CORE: reusable components, views, router, boot
// =====================================================
const app = $('#app');
const empty = (msg, label, href, attr = '') => `<div class="empty"><p>${msg}</p><a class="btn" href="${href}" ${attr}>${label}</a></div>`;

// ---------- TOAST ----------
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  $('#toasts').append(t); setTimeout(() => t.remove(), 2600);
}
function updateBadges() {
  $('#bm-count').textContent = loadBookmarks().length;
  $('#cart-count').textContent = Object.values(loadCart()).reduce((a, b) => a + b, 0);
}

// ---------- REUSABLE COMPONENT (article/character/trailer/event/product cards) ----------
function createContentCard(i) {
  const c = catBy(i.category), on = loadBookmarks().includes(i.id);
  return `<article class="card reveal cat-${c.slug}"><div class="thumb">
  <img src="${i.img}" alt="${i.title} — ${i.category} ${i.type} artwork" loading="lazy" width="500" height="300">
  <span class="ico-chip">${c.icon}</span><span class="badge">${i.type}${i.status ? ' • ' + i.status : ''}</span></div>
  <div class="body"><small class="meta">${i.category} • ${i.date}</small><h3>${i.title}</h3><p>${i.description}</p>
  <div class="row">${i.type === 'merchandise' ? `<b>$${i.price}</b><button class="btn sm" data-cart="${i.id}">Add to Cart</button>` : ''}
  <button class="bm ${on ? 'on' : ''}" data-bm="${i.id}" aria-pressed="${on}" aria-label="Bookmark ${i.title}">${on ? '★' : '☆'}</button></div></div></article>`;
}

// ---------- VIEW: HOME (hero, categories, trending) ----------
function viewHome() {
  const trending = sortContent(FV.items, 'pop').slice(0, 8);
  app.innerHTML = `
  <!-- HERO SECTION: main landing-page visual and CTA -->
  <div class="hero-bg" aria-hidden="true"><img src="${img('fv-hero-skyline', 1600, 1000)}" alt=""></div>
  <section class="container hero" id="hero"><div><span class="label">THE ULTIMATE FANDOM HUB</span><h1>ENTER YOUR FANDOM.</h1>
    <p>Discover anime, gaming, movies, TV shows, K-Pop, comics and manga — all in one universe.</p>
    <a class="btn" href="#cats">EXPLORE FANDOMS</a><a class="btn ghost" href="#/search">DISCOVER TRENDING</a></div>
    <div class="stack" aria-hidden="true"><div class="float glass f1 cat-anime"><img src="${img('fv-float-anime', 230, 130)}" alt=""><b>ANIME // 001</b>Neon Shrine<br><small class="muted">Trending now</small></div>
    <div class="float glass f2 cat-gaming"><img src="${img('fv-float-gaming', 230, 130)}" alt=""><b>GAMING // 002</b>Voidrunner<br><small class="muted">New trailer</small></div>
    <div class="float glass f3 cat-kpop"><img src="${img('fv-float-kpop', 230, 130)}" alt=""><b>K-POP // 003</b>LUMEN-7<br><small class="muted">Live event</small></div></div></section>
  <!-- CATEGORY SECTION: modify fandom category cards here -->
  <section class="container" id="cats"><h2 class="h2">CHOOSE YOUR UNIVERSE</h2><p class="muted">One Universe. Every Fandom.</p>
    <div class="grid">${CATS.map(c => `<a class="cat reveal cat-${c.slug}" href="#/cat/${c.slug}"><img src="${c.cover}" alt="${c.name} cover artwork" loading="lazy" width="450" height="300"><div class="cat-body"><span class="ico">${c.icon}</span><h3>${c.name.toUpperCase()}</h3><p>${c.desc}</p><small>${FV.items.filter(i => i.category === c.name).length} ITEMS</small><span class="btn sm">Explore</span></div></a>`).join('')}</div></section>
  <!-- FEATURED CONTENT: modify trending cards here -->
  <section class="container" id="featured-content"><h2 class="h2">WHAT'S TRENDING</h2><p class="muted">Your next obsession starts here.</p>
    <div class="grid" id="trending">${trending.map(createContentCard).join('')}</div></section>`;
  const hero = $('#hero');
  if (!matchMedia('(prefers-reduced-motion:reduce)').matches) hero.addEventListener('mousemove', e => {
    hero.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(2)); hero.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(2));
  });
}

// ---------- VIEW: CATEGORY HUB + GLOBAL SEARCH (same component) ----------
function viewBrowse(slug) {
  const c = slug && catBy(slug);
  app.innerHTML = `<section class="container page"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / ${c ? `<span>${c.name}</span>` : '<span>Search</span>'}</nav>
  <h1 class="h1">${c ? c.name.toUpperCase() + ' UNIVERSE' : 'GLOBAL SEARCH'}</h1>${c ? `<p class="muted">${c.desc}</p>` : ''}
  <div class="filters glass"><input id="q" type="search" placeholder="Search the universe…" aria-label="Search">
  ${c ? '' : `<select id="fc" aria-label="Category"><option value="">All categories</option>${CATS.map(x => `<option>${x.name}</option>`).join('')}</select>`}
  <select id="ft" aria-label="Content type"><option value="">All types</option>${TYPES.map(t => `<option>${t}</option>`).join('')}</select>
  <select id="fs" aria-label="Sort"><option value="pop">Popular</option><option value="new">Newest</option><option value="az">A–Z</option><option value="feat">Featured</option></select>
  <button id="clr" class="btn sm" type="button">Clear</button></div>
  <p id="count" class="count" aria-live="polite"></p><div id="results" class="grid"></div></section>`;
  const run = () => {
    let l = searchContent(FV.items, $('#q').value);
    l = sortContent(filterContent(l, { cat: c ? c.name : $('#fc')?.value, type: $('#ft').value }), $('#fs').value);
    $('#count').textContent = `${l.length} RESULTS FOUND`;
    $('#results').innerHTML = l.length ? l.map(createContentCard).join('') : empty('No fandom signal detected.', 'EXPLORE CATEGORIES', '#/');
    observe();
  };
  $('.filters').addEventListener('input', run);
  $('#clr').onclick = () => { $('.filters').querySelectorAll('input,select').forEach(e => e.value = e.tagName === 'SELECT' ? e.options[0].value : ''); run(); };
  run();
}

// ---------- VIEW: BOOKMARKS ----------
function viewBookmarks() {
  const ids = loadBookmarks(), l = FV.items.filter(i => ids.includes(i.id));
  app.innerHTML = `<section class="container page"><nav class="crumbs"><a href="#/">Home</a> / Bookmarks</nav><h1 class="h1">YOUR FANDOM VAULT</h1>
  ${l.length ? `<p class="count">${l.length} SAVED ITEMS</p><div class="grid">${l.map(createContentCard).join('')}</div><p><button class="btn" data-export>Export Bookmarks</button></p>` : empty('Your fandom vault is empty.', 'EXPLORE CATEGORIES', '#/search')}
  <h2 class="h2">Personal Notes</h2><p class="muted">Saved in SessionStorage — cleared when the tab closes.</p>
  <textarea id="notes" class="notes" aria-label="Personal notes">${sessionStorage.getItem(NOTES_KEY) || ''}</textarea></section>`;
  $('#notes').addEventListener('input', e => sessionStorage.setItem(NOTES_KEY, e.target.value));
}

// ---------- VIEW: CART ----------
function viewCart() {
  const rows = Object.entries(loadCart()).map(([id, q]) => [FV.items.find(i => i.id === id), q]).filter(r => r[0]);
  app.innerHTML = `<section class="container page"><nav class="crumbs"><a href="#/">Home</a> / Cart</nav><h1 class="h1">MERCH CART</h1><div class="banner">Demo Cart — No Purchase Available</div>
  ${rows.length ? `<div class="tablewrap"><table><thead><tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>
  ${rows.map(([p, q]) => `<tr><td>${p.title}</td><td><button class="bm" data-qty="${p.id}" data-d="-1" aria-label="Decrease">−</button> ${q} <button class="bm" data-qty="${p.id}" data-d="1" aria-label="Increase">+</button></td><td>$${p.price}</td><td>$${(p.price * q).toFixed(2)}</td><td><button class="btn sm" data-rm="${p.id}">Remove</button></td></tr>`).join('')}</tbody></table></div>
  <p class="total">Total: <b>$${calculateCartTotal().toFixed(2)}</b></p>` : empty('No merchandise in your cart.', 'BROWSE MERCH', '#/search')}</section>`;
}

// ---------- VIEW: ABOUT / CONTACT ----------
function viewAbout() {
  const cards = [['Mission', 'A unified portal for exploring multiple fandom communities.'], ['Features', 'Search, filters, bookmarks, demo cart, events, trailers and a scripted guide.'], ['Technology', 'HTML5, CSS3, vanilla JavaScript, JSON, LocalStorage and SessionStorage.'], ['Project Team', 'Add your team member names and roles here.']];
  app.innerHTML = `<section class="container page"><nav class="crumbs"><a href="#/">Home</a> / About</nav><h1 class="h1">ABOUT FANDOMVERSE</h1><div class="about-grid">${cards.map(([h, t]) => `<div class="glass reveal"><h3>${h}</h3><p class="muted">${t}</p></div>`).join('')}</div></section>`;
}
function viewContact() {
  app.innerHTML = `<section class="container page"><nav class="crumbs"><a href="#/">Home</a> / Contact</nav><h1 class="h1">CONTACT</h1>
  <form class="contact" id="cform"><label>Name<input required></label><label>Email<input type="email" required></label><label>Subject<input required></label><label>Message<textarea rows="5" required></textarea></label><button class="btn">Submit</button><p class="muted"><small>Frontend-only form — nothing is sent.</small></p></form>
  <p class="muted">📍 Your University Address • ✉ team@fandomverse.example • ☎ +00 000 0000</p></section>`;
  $('#cform').onsubmit = e => { e.preventDefault(); e.target.reset(); toast('Message noted (demo only).'); };
}

// ---------- SCROLL REVEAL ----------
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
const observe = () => document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));

// ---------- ROUTER ----------
function route() {
  const [, v, a] = location.hash.slice(1).split('/');
  if (v === 'cats') return;
  if (!FV.items.length) app.innerHTML = `<div class="container page">${empty('Fandom data temporarily unavailable.', 'Try Again', '#/', 'data-retry')}<p class="muted" style="text-align:center">Serve the folder over HTTP (see README).</p></div>`;
  else if (v === 'cat' && catBy(a)) viewBrowse(a);
  else if (v === 'search') viewBrowse();
  else if (v === 'bookmarks') viewBookmarks();
  else if (v === 'cart') viewCart();
  else if (v === 'about') viewAbout();
  else if (v === 'contact') viewContact();
  else viewHome();
  document.querySelectorAll('#menu a').forEach(l => l.toggleAttribute('aria-current', l.getAttribute('href') === location.hash || (l.getAttribute('href') === '#/' && !v)));
  $('#menu').classList.remove('open'); $('#nav').classList.remove('menu-open'); $('#burger').setAttribute('aria-expanded', 'false');
  scrollTo(0, 0); observe();
}

// ---------- NAV / EVENTS ----------
function buildNav() {
  $('#menu').innerHTML = [['Home', '#/'], ['Explore', '#/search'], ...CATS.map(c => [c.name, `#/cat/${c.slug}`])].map(([n, h]) => `<a href="${h}">${n}</a>`).join('');
  $('#f-cats').innerHTML = CATS.map(c => `<a href="#/cat/${c.slug}">${c.name}</a>`).join('');
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-bm],[data-cart],[data-rm],[data-qty],[data-export],[data-retry]'); if (!t) return;
  if (t.dataset.bm) { const on = toggleBookmark(t.dataset.bm); t.classList.toggle('on', on); t.textContent = on ? '★' : '☆'; t.setAttribute('aria-pressed', on); if (location.hash === '#/bookmarks') route(); }
  else if (t.dataset.cart) addToCart(t.dataset.cart);
  else if (t.dataset.rm) { removeFromCart(t.dataset.rm); route(); }
  else if (t.dataset.qty) { setQty(t.dataset.qty, (loadCart()[t.dataset.qty] || 0) + +t.dataset.d); route(); }
  else if ('export' in t.dataset) exportBookmarks();
  else if ('retry' in t.dataset) { e.preventDefault(); boot(); }
});
addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', scrollY > 30), { passive: true });
$('#burger').onclick = () => { const o = $('#menu').classList.toggle('open'); $('#nav').classList.toggle('menu-open', o); $('#burger').setAttribute('aria-expanded', o); };
// Login / signup modal (UI only)
let signup = false;
$('#login-btn').onclick = () => $('#auth').showModal();
$('#auth-x').onclick = () => $('#auth').close();
$('#auth-switch').onclick = () => { signup = !signup; $('#auth-title').textContent = signup ? 'SIGN UP' : 'LOGIN'; $('#name-row').hidden = !signup; $('#auth-switch').textContent = signup ? 'Have an account? Login' : 'Need an account? Sign up'; };
$('#auth-form').onsubmit = e => { e.preventDefault(); $('#auth').close(); toast('Demo interface — authentication is not connected.'); };

// ---------- BOOT ----------
async function boot() {
  app.innerHTML = `<div class="container grid page">${'<div class="card skel"></div>'.repeat(8)}</div>`;
  await loadContent();
  if (FV.failed && FV.items.length) toast('Some fandom data failed to load.');
  route();
}
addEventListener('hashchange', route);
buildNav(); updateBadges(); updateVisitorCounter(); updateClock(); setInterval(updateClock, 1000); initChatbot(); boot();
