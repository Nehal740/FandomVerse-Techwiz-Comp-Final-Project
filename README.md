# FandomVerse — Portal for the Fandom World
Frontend-only academic project (HTML5, CSS3, vanilla JS, JSON, LocalStorage/SessionStorage). No backend.

## Run
`fetch()` needs HTTP, so serve the folder: `python3 -m http.server 8000` then open http://localhost:8000
(or VS Code "Live Server"). Opening index.html via file:// shows the "data unavailable" state.

## Structure
- `index.html` — shell + mount points (single-page app, hash routes: `#/`, `#/cat/anime`, `#/search`, `#/bookmarks`, `#/cart`, `#/about`, `#/contact`)
- `css/style.css` — variables (top of file), components · `responsive.css` · `animations.css` (incl. reduced motion)
- `js/data.js` categories + JSON loader · `search.js` · `filters.js` · `bookmarks.js` · `cart.js` · `chatbot.js` · `visitor-counter.js` · `clock.js` · `app.js` views/router
- `data/*.json` — content (7 category files, characters, events, merchandise, chatbot). Sample content is fictional.
- `pages/` — reserved (the SPA renders these views dynamically)

## Where to edit
Theme colours: `:root` in style.css · Categories: `CATS` in data.js · Chatbot replies: data/chatbot.json · Nav/footer: `buildNav()` + index.html

## Not yet implemented (roadmap)
Article/character detail pages, gallery lightbox, audio/video players, events timeline UI, real artwork.
