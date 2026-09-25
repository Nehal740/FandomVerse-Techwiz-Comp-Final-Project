// =====================================================
// CHATBOT (FANDOM GUIDE)
// Scripted keyword matching over data/chatbot.json. No external API.
// Modify replies in data/chatbot.json, behaviour here
// =====================================================
let BOT = [];
const TIPS = ['What is trending?', 'Show me anime content', 'Find gaming content', 'What events are coming?', 'Where can I find merchandise?', 'How do bookmarks work?'];
function botMsg(text, link, cls = 'bot') {
  const d = document.createElement('div'); d.className = 'msg ' + cls; d.textContent = text;
  if (link) { const a = document.createElement('a'); a.href = link.href; a.className = 'btn sm'; a.textContent = link.label; d.append(a); }
  const log = $('#bot-log'); log.append(d); log.scrollTop = log.scrollHeight; return d;
}
function sendChatMessage(text) {
  text = text.trim(); if (!text) return;
  botMsg(text, null, 'me');
  const t = botMsg('…', null, 'bot typing');
  setTimeout(() => {
    t.remove(); const l = text.toLowerCase();
    const hit = BOT.find(b => b.keys.some(k => l.includes(k))) || BOT.find(b => !b.keys.length);
    if (hit) botMsg(hit.reply, hit.href ? { href: hit.href, label: hit.label } : null);
  }, 700);
}
async function initChatbot() {
  try { BOT = await (await fetch('data/chatbot.json')).json(); } catch { BOT = [{ keys: [], reply: 'Fandom Guide is offline right now.' }]; }
  botMsg('Welcome, explorer! Ask me about FandomVerse.');
  $('#bot-tips').innerHTML = TIPS.map(t => `<button type="button">${t}</button>`).join('');
  $('#bot-tips').addEventListener('click', e => e.target.matches('button') && sendChatMessage(e.target.textContent));
  $('#bot-form').addEventListener('submit', e => { e.preventDefault(); sendChatMessage($('#bot-in').value); $('#bot-in').value = ''; });
  const set = o => { $('#bot').classList.toggle('open', o); $('#bot').setAttribute('aria-hidden', !o); $('#bot-btn').setAttribute('aria-expanded', o); if (o) $('#bot-in').focus(); };
  $('#bot-btn').onclick = () => set(!$('#bot').classList.contains('open'));
  $('#bot-x').onclick = () => set(false);
  document.addEventListener('keydown', e => e.key === 'Escape' && set(false));
}
