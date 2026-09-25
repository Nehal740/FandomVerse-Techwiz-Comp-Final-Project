// =====================================================
// SHOPPING CART
// Temporary frontend-only cart (LocalStorage). No checkout exists.
// Modify cart calculations here
// =====================================================
const CART_KEY = 'fv_cart';
const loadCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; } };
const saveCart = c => { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateBadges(); };
function addToCart(id) { const c = loadCart(); c[id] = (c[id] || 0) + 1; saveCart(c); toast('Added to cart.'); }
function removeFromCart(id) { const c = loadCart(); delete c[id]; saveCart(c); toast('Item removed.'); }
function setQty(id, q) { if (q < 1) return removeFromCart(id); const c = loadCart(); c[id] = q; saveCart(c); }
function calculateCartTotal() {
  return Object.entries(loadCart()).reduce((s, [id, q]) => { const p = FV.items.find(i => i.id === id); return s + (p ? p.price * q : 0); }, 0);
}
