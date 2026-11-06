import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { STAGE_LABEL } from '../data/menu';
import { calcTotals, money } from './utils';

/* The chatbot's "brain": text in -> a reply out.
   BEFORE: it built HTML strings (and had to call safe() on user text).
   NOW:    it returns JSX. React escapes text automatically, so no safe() and no innerHTML. */

const WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
const STOP = new Set(['add', 'remove', 'delete', 'order', 'get', 'me', 'i', 'want', 'to', 'the', 'a', 'an', 'of', 'with', 'and', 'please', 'cart', 'my', 'in', 'from', 'one', 'two', 'three', 'four', 'five', 'six', 'pcs', 'some', 'for', 'price', 'cost', 'how', 'much', 'is', 'does', 'what', 'whats', 'it', 'have', 'you', 'do', 'can', 'put', 'into', 'take', 'give']);
const CATS = { biryani: 'Biryani', biryanis: 'Biryani', tiffin: 'Tiffins', tiffins: 'Tiffins', breakfast: 'Tiffins', snack: 'Snacks', snacks: 'Snacks', starter: 'Snacks', starters: 'Snacks', dessert: 'Desserts', desserts: 'Desserts', sweet: 'Desserts', sweets: 'Desserts', dinner: 'Dinner', meal: 'Dinner' };

export const QUICK = ['Recommend something', 'Veg under ₹150', 'Show my cart', 'Spicy picks', 'Desserts', 'Track my last order', 'Help'];

const tokens = s => s.toLowerCase().replace(/[^a-z0-9₹ ]/g, ' ').split(/\s+/).filter(Boolean);

/* "+ Add" button inside a bot message. It remembers by itself that it was clicked. */
function AddButton({ id }) {
  const { addToCart } = useShop();
  const [added, setAdded] = useState(false);
  return (
    <button className="ffbot-add" disabled={added} onClick={() => { addToCart(id); setAdded(true); }}>
      {added ? '✓ Added' : '+ Add'}
    </button>
  );
}

function DishRows({ list }) {
  return list.map(x => (
    <div className="ffbot-dish" key={x.id}>
      <span><b>{x.name}</b><em>{x.veg ? 'Veg' : 'Non-veg'} · {x.category} · {money(x.price)}</em></span>
      {x.available ? <AddButton id={x.id} /> : <em>Sold out</em>}
    </div>
  ));
}

function CartSummary({ cart, delivery, promo }) {
  if (!cart.length) return <>Your cart is empty. Ask me to <b>add</b> something, for example "add 2 masala dosa".</>;
  const t = calcTotals(cart, delivery, promo);
  return (
    <>
      {cart.map(x => <span key={x.foodId}>{x.name} × {x.quantity} <b>{money(x.price * x.quantity)}</b><br /></span>)}
      <br />
      Subtotal <b>{money(t.sub)}</b> · Delivery <b>{t.fee ? money(t.fee) : 'Free'}</b>
      {t.discount > 0 && <> · Discount <b>-{money(t.discount)}</b></>}
      <br />Total <b>{money(t.total)}</b>
    </>
  );
}

function findDishes(menu, text) {
  const q = tokens(text).filter(w => !STOP.has(w) && !/^\d+$/.test(w));
  if (!q.length) return [];
  const scored = menu.map(m => {
    const nt = tokens(m.name);
    let s = 0;
    q.forEach(w => { if (nt.includes(w)) s += 3; else if (nt.some(n => n.startsWith(w) || w.startsWith(n))) s += 1; });
    return { m, s };
  }).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  if (!scored.length) return [];
  const top = scored[0].s;
  return scored.filter(x => x.s >= Math.max(top - 1, 1)).slice(0, 5).map(x => x.m);
}

function getQty(text) {
  const m = text.toLowerCase().match(/\b(\d{1,2})\b/);
  if (m) return Math.min(20, Math.max(1, Number(m[1])));
  for (const w of tokens(text)) if (WORDS[w]) return WORDS[w];
  return 1;
}

function filterMenu(menu, text) {
  const low = text.toLowerCase();
  let list = menu.filter(x => x.available);
  const cat = tokens(low).map(w => CATS[w]).find(Boolean);
  if (cat) list = list.filter(x => x.category === cat);
  if (/\b(non[- ]?veg|chicken|mutton|meat)\b/.test(low) && !/\bveg only\b/.test(low)) list = list.filter(x => !x.veg);
  else if (/\bveg(etarian)?\b/.test(low)) list = list.filter(x => x.veg);
  const p = low.match(/(?:under|below|less than|within|upto|up to|max)\s*₹?\s*(\d+)/);
  if (p) list = list.filter(x => x.price <= Number(p[1]));
  if (/\b(spicy|hot|karam|65|chilli|pepper)\b/.test(low)) list = list.filter(x => /spic|karam|65|chilli|pepper|andhra|masala|ulavacharu/i.test(x.name + ' ' + x.description));
  if (/\b(cheap|budget|affordable)\b/.test(low)) list = [...list].sort((a, b) => a.price - b.price);
  return { list, cat, price: p ? Number(p[1]) : null };
}

export function greeting(user) {
  const name = (user?.full_name || '').split(' ')[0] || 'there';
  return <>Hi {name}! I'm <b>FusionBot</b>. I can recommend dishes, add items to your cart, apply promo codes and track orders. Type <b>help</b> to see everything.</>;
}

/* shop = everything from useShop(), plus { goTab, openTracker, closeBot } */
export function reply(text, shop) {
  const { menu, delivery, myOrders, getCart, getPromo } = shop;
  const low = text.toLowerCase().trim();
  const has = re => re.test(low);
  const summary = () => <CartSummary cart={getCart()} delivery={delivery} promo={getPromo()} />;

  if (has(/^(hi|hello|hey|hii|namaste|good (morning|evening|afternoon))\b/)) return 'Hello! Hungry? Ask me for a recommendation or tell me what to add to your cart.';
  if (has(/\b(thanks|thank you|thx)\b/)) return 'Anytime! Enjoy your meal.';
  if (has(/\bhelp\b|what can you do/)) return (
    <>Here is what I can do:<br />
      • <b>Recommend</b> dishes: "veg under ₹150", "spicy snacks"<br />
      • <b>Add / remove</b>: "add 2 chicken biryani", "remove dosa"<br />
      • <b>Prices</b>: "price of mango kulfi"<br />
      • <b>Cart</b>: "show my cart", "clear cart", "checkout"<br />
      • <b>Promo</b>: "apply FUSION10"<br />
      • <b>Track</b>: "track ORD-1001" or "track my last order"<br />
      • <b>Delivery info</b>: "delivery fee"</>
  );

  /* promo */
  const promo = low.match(/\b(fusion10|free30)\b/);
  if (promo || has(/promo|coupon|discount code/)) {
    if (!promo) return <>Try <b>FUSION10</b> for 10% off, or <b>FREE30</b> for free delivery. Say "apply FUSION10".</>;
    if (!getCart().length) return 'Add something to your cart first, then I will apply the code.';
    const code = promo[1].toUpperCase();
    shop.applyPromo(code);
    return <>Applied <b>{code}</b>.<br />{summary()}</>;
  }

  /* cart actions */
  if (has(/clear (my )?cart|empty (my )?cart/)) { shop.clearCart(); return 'Done. Your cart is empty.'; }
  if (has(/\b(show|view|what'?s in|see)\b.*\bcart\b|^cart$|my cart/)) return summary();
  if (has(/checkout|place (my )?order|pay\b|proceed/)) {
    if (!getCart().length) return 'Your cart is empty. Add a dish first.';
    shop.goTab('cart');
    shop.closeBot();
    return null;
  }

  /* track */
  if (has(/track|where.*order|order status|status/)) {
    const id = (text.match(/ord-?\s*\d+/i) || [''])[0].replace(/\s/g, '').toUpperCase().replace(/^ORD(?!-)/, 'ORD-');
    const o = id ? myOrders.find(x => x.id === id) : myOrders[0];
    if (!o) return id ? <>I could not find <b>{id}</b>.</> : 'You have no orders yet.';
    return (
      <>
        <b>{o.id}</b> is <b>{STAGE_LABEL[o.status] || o.status}</b>.<br />
        {o.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}<br />
        Total {money(o.total)}.<br />
        <button className="ffbot-add" style={{ marginTop: 8 }} onClick={() => { shop.openTracker(o.id); shop.closeBot(); }}>
          Open tracker
        </button>
      </>
    );
  }

  /* delivery */
  if (has(/delivery|shipping|free delivery/)) return (
    <>Delivery fee is <b>{money(delivery.fee)}</b>{delivery.threshold ? <>, and <b>free above {money(delivery.threshold)}</b></> : null}.</>
  );

  /* remove */
  if (has(/\b(remove|delete|take out|drop)\b/)) {
    const hit = findDishes(menu, text).find(m => getCart().some(c => c.foodId === m.id));
    if (!hit) return 'I could not find that dish in your cart.';
    shop.removeItem(hit.id);
    return <>Removed <b>{hit.name}</b>.</>;
  }

  /* add */
  if (has(/\b(add|order|get me|i want|i'?ll have|put|buy|give me)\b/)) {
    const found = findDishes(menu, text);
    if (!found.length) return 'I could not match that to a dish. Try the exact name, like "add chicken dum biryani".';
    const n = getQty(text);
    const exact = found.length === 1 || (found[0] && tokens(text).filter(w => !STOP.has(w)).length >= tokens(found[0].name).length - 1);
    if (exact && found[0].available) {
      shop.addToCart(found[0].id, n);
      return <>Added <b>{n} × {found[0].name}</b> to your cart.<br />{summary()}</>;
    }
    return <>Which one did you mean?<DishRows list={found} /></>;
  }

  /* price / info */
  if (has(/price|cost|how much/)) {
    const found = findDishes(menu, text);
    if (found.length) return <DishRows list={found.slice(0, 3)} />;
  }

  /* recommend / filter */
  if (has(/recommend|suggest|best|popular|chef|surprise|hungry|what should|something/) || has(/veg|spicy|under|below|cheap|budget|biryani|tiffin|snack|dessert|dinner|sweet|breakfast|starter/)) {
    const { list, cat, price } = filterMenu(menu, text);
    if (!list.length) return 'Nothing matches that right now. Try a different budget or category.';
    let pick = list;
    if (has(/recommend|suggest|surprise|something|best|popular/) && !cat && price === null) pick = [...list].sort(() => Math.random() - 0.5);
    const shown = pick.slice(0, 4);
    return (
      <>Here {shown.length === 1 ? 'is a pick' : 'are some picks'} for you{list.length > shown.length ? ` (${list.length} match)` : ''}:
        <DishRows list={shown} /></>
    );
  }

  /* fallback: maybe they just typed a dish name */
  const f = findDishes(menu, text);
  if (f.length) return <>Is this what you are looking for?<DishRows list={f.slice(0, 3)} /></>;
  return 'I did not catch that. Try "recommend something", "add 2 masala dosa" or "help".';
}
