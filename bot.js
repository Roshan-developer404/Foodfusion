'use strict';
/* =========================================================
   FoodFusion mini AI agent: bot.js
   Runs fully in the browser (no API key). It reads the live
   menu / cart / orders from script.js and can act on them.
   ========================================================= */
(function () {
  const WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  const STOP = new Set(['add', 'remove', 'delete', 'order', 'get', 'me', 'i', 'want', 'to', 'the', 'a', 'an', 'of', 'with', 'and', 'please', 'cart', 'my', 'in', 'from', 'one', 'two', 'three', 'four', 'five', 'six', 'pcs', 'some', 'for', 'price', 'cost', 'how', 'much', 'is', 'does', 'what', 'whats', 'it', 'have', 'you', 'do', 'can', 'put', 'into', 'take', 'give']);
  const CATS = { biryani: 'Biryani', biryanis: 'Biryani', tiffin: 'Tiffins', tiffins: 'Tiffins', breakfast: 'Tiffins', snack: 'Snacks', snacks: 'Snacks', starter: 'Snacks', starters: 'Snacks', dessert: 'Desserts', desserts: 'Desserts', sweet: 'Desserts', sweets: 'Desserts', dinner: 'Dinner', meal: 'Dinner' };

  const $ = id => document.getElementById(id);
  const tokens = s => s.toLowerCase().replace(/[^a-z0-9₹ ]/g, ' ').split(/\s+/).filter(Boolean);

  /* ---------- UI ---------- */
  const root = document.createElement('div');
  root.id = 'ffbot-root';
  root.className = 'hidden';
  root.innerHTML = `
    <button class="ffbot-fab" aria-label="Open FoodFusion assistant" title="Ask FoodFusion Bot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path d="M9.5 16.5h5"/></svg>
    </button>
    <section class="ffbot-panel" role="dialog" aria-label="FoodFusion assistant">
      <div class="ffbot-head"><div><b>FusionBot</b><small>Your food assistant</small></div><button class="x" aria-label="Close">×</button></div>
      <div class="ffbot-log" aria-live="polite"></div>
      <div class="ffbot-chips"></div>
      <form class="ffbot-form"><input placeholder="Try: add 2 chicken biryani" aria-label="Message" autocomplete="off"><button>Send</button></form>
    </section>`;
  document.body.append(root);

  const panel = root.querySelector('.ffbot-panel');
  const log = root.querySelector('.ffbot-log');
  const input = root.querySelector('input');
  const chips = root.querySelector('.ffbot-chips');

  const QUICK = ['Recommend something', 'Veg under ₹150', 'Show my cart', 'Spicy picks', 'Desserts', 'Track my last order', 'Help'];
  QUICK.forEach(q => { const b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.onclick = () => ask(q); chips.append(b); });

  const say = (html, who = 'bot') => {
    const d = document.createElement('div');
    d.className = 'ffbot-msg ' + who;
    d.innerHTML = html;
    log.append(d);
    log.scrollTop = log.scrollHeight;
    return d;
  };
  const dishRows = list => list.map(x =>
    `<div class="ffbot-dish"><span><b>${safe(x.name)}</b><em>${x.veg ? 'Veg' : 'Non-veg'} · ${safe(x.category)} · ${money(x.price)}</em></span>` +
    (x.available ? `<button class="ffbot-add" data-add="${x.id}">+ Add</button>` : '<em>Sold out</em>') + '</div>').join('');

  function open(v) {
    panel.classList.toggle('open', v);
    if (v) { input.focus(); if (!log.children.length) greet(); }
  }
  root.querySelector('.ffbot-fab').onclick = () => open(!panel.classList.contains('open'));
  root.querySelector('.x').onclick = () => open(false);

  log.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const id = Number(b.dataset.add);
    addToCart(id);
    b.textContent = '✓ Added';
    b.disabled = true;
  });

  root.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const t = input.value.trim();
    if (t) { input.value = ''; ask(t); }
  });

  /* show the bot only while signed in */
  const appView = $('app-view');
  const sync = () => {
    const out = appView.classList.contains('hidden');
    root.classList.toggle('hidden', out);
    if (out) { panel.classList.remove('open'); log.replaceChildren(); }   /* signed out: forget the chat */
  };
  new MutationObserver(sync).observe(appView, { attributes: true, attributeFilter: ['class'] });
  sync();

  /* ---------- brain ---------- */
  function ask(text) {
    say(safe(text), 'user');
    const t = say('<span class="ffbot-typing"><i></i><i></i><i></i></span>');
    setTimeout(() => { t.remove(); try { reply(text); } catch (err) { say('Sorry, something went wrong. Please try again.'); console.error(err); } }, 350);
  }

  function greet() {
    const name = (currentUser?.full_name || '').split(' ')[0] || 'there';
    say(`Hi ${safe(name)}! I'm <b>FusionBot</b>. I can recommend dishes, add items to your cart, apply promo codes and track orders. Type <b>help</b> to see everything.`);
  }

  function findDishes(text) {
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
  const getQty = text => {
    const m = text.toLowerCase().match(/\b(\d{1,2})\b/);
    if (m) return Math.min(20, Math.max(1, Number(m[1])));
    for (const w of tokens(text)) if (WORDS[w]) return WORDS[w];
    return 1;
  };

  function filterMenu(text) {
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

  function cartSummary() {
    if (!cart.length) return 'Your cart is empty. Ask me to <b>add</b> something, for example "add 2 masala dosa".';
    const t = totals();
    return cart.map(x => `${safe(x.name)} × ${x.quantity} <b>${money(x.price * x.quantity)}</b>`).join('<br>') +
      `<br><br>Subtotal <b>${money(t.sub)}</b> · Delivery <b>${t.fee ? money(t.fee) : 'Free'}</b>` +
      (t.discount ? ` · Discount <b>-${money(t.discount)}</b>` : '') + `<br>Total <b>${money(t.total)}</b>`;
  }

  function reply(text) {
    const low = text.toLowerCase().trim();
    const has = re => re.test(low);

    if (has(/^(hi|hello|hey|hii|namaste|good (morning|evening|afternoon))\b/)) return say('Hello! Hungry? Ask me for a recommendation or tell me what to add to your cart.');
    if (has(/\b(thanks|thank you|thx)\b/)) return say('Anytime! Enjoy your meal.');
    if (has(/\bhelp\b|what can you do/)) return say('Here is what I can do:<br>• <b>Recommend</b> dishes: "veg under ₹150", "spicy snacks"<br>• <b>Add / remove</b>: "add 2 chicken biryani", "remove dosa"<br>• <b>Prices</b>: "price of mango kulfi"<br>• <b>Cart</b>: "show my cart", "clear cart", "checkout"<br>• <b>Promo</b>: "apply FUSION10"<br>• <b>Track</b>: "track ORD-1001" or "track my last order"<br>• <b>Delivery info</b>: "delivery fee"');

    /* promo */
    const promo = low.match(/\b(fusion10|free30)\b/);
    if (promo || has(/promo|coupon|discount code/)) {
      if (!promo) return say('Try <b>FUSION10</b> for 10% off, or <b>FREE30</b> for free delivery. Say "apply FUSION10".');
      if (!cart.length) return say('Add something to your cart first, then I will apply the code.');
      $('promo-input').value = promo[1].toUpperCase();
      applyPromoCode();
      return say(`Applied <b>${promo[1].toUpperCase()}</b>.<br>${cartSummary()}`);
    }

    /* cart actions */
    if (has(/clear (my )?cart|empty (my )?cart/)) { clearCart(); return say('Done. Your cart is empty.'); }
    if (has(/\b(show|view|what'?s in|see)\b.*\bcart\b|^cart$|my cart/)) return say(cartSummary());
    if (has(/checkout|place (my )?order|pay\b|proceed/)) {
      if (!cart.length) return say('Your cart is empty. Add a dish first.');
      switchTab('cart-sec'); open(false);
      return;
    }

    /* track */
    if (has(/track|where.*order|order status|status/)) {
      const id = (text.match(/ord-?\s*\d+/i) || [''])[0].replace(/\s/g, '').toUpperCase().replace(/^ORD(?!-)/, 'ORD-');
      const o = id ? orders.find(x => x.id === id) : orders[0];
      if (!o) return say(id ? `I could not find <b>${safe(id)}</b>.` : 'You have no orders yet.');
      return say(`<b>${o.id}</b> is <b>${STAGE_LABEL[o.status] || o.status}</b>.<br>${o.items.map(i => `${safe(i.name)} × ${i.quantity}`).join(', ')}<br>Total ${money(o.total)}.<br><button class="ffbot-add" id="ffbot-open-track" style="margin-top:8px">Open tracker</button>`)
        .querySelector('#ffbot-open-track').onclick = () => { switchTab('track-sec'); $('track-input').value = o.id; searchOrder(); open(false); };
    }

    /* delivery */
    if (has(/delivery|shipping|free delivery/)) return say(`Delivery fee is <b>${money(delivery.fee)}</b>${delivery.threshold ? `, and <b>free above ${money(delivery.threshold)}</b>` : ''}.`);

    /* remove */
    if (has(/\b(remove|delete|take out|drop)\b/)) {
      const hit = findDishes(text).find(m => cart.some(c => c.foodId === m.id));
      if (!hit) return say('I could not find that dish in your cart.');
      removeItem(hit.id);
      return say(`Removed <b>${safe(hit.name)}</b>.`);
    }

    /* add */
    if (has(/\b(add|order|get me|i want|i'?ll have|put|buy|give me)\b/)) {
      const found = findDishes(text);
      if (!found.length) return say('I could not match that to a dish. Try the exact name, like "add chicken dum biryani".');
      const n = getQty(text);
      const exact = found.length === 1 || (found[0] && tokens(text).filter(w => !STOP.has(w)).length >= tokens(found[0].name).length - 1);
      if (exact && found[0].available) {
        for (let i = 0; i < n; i++) addToCart(found[0].id);
        return say(`Added <b>${n} × ${safe(found[0].name)}</b> to your cart.<br>${cartSummary()}`);
      }
      return say('Which one did you mean?' + dishRows(found));
    }

    /* price / info */
    if (has(/price|cost|how much/)) {
      const found = findDishes(text);
      if (found.length) return say(dishRows(found.slice(0, 3)));
    }

    /* recommend / filter */
    if (has(/recommend|suggest|best|popular|chef|surprise|hungry|what should|something/) || has(/veg|spicy|under|below|cheap|budget|biryani|tiffin|snack|dessert|dinner|sweet|breakfast|starter/)) {
      const { list, cat, price } = filterMenu(text);
      if (!list.length) return say('Nothing matches that right now. Try a different budget or category.');
      let pick = list;
      if (has(/recommend|suggest|surprise|something|best|popular/) && !cat && price === null) pick = [...list].sort(() => Math.random() - .5);
      const shown = pick.slice(0, 4);
      return say(`Here ${shown.length === 1 ? 'is a pick' : 'are some picks'} for you${list.length > shown.length ? ` (${list.length} match)` : ''}:` + dishRows(shown));
    }

    /* fallback: maybe they just typed a dish name */
    const f = findDishes(text);
    if (f.length) return say('Is this what you are looking for?' + dishRows(f.slice(0, 3)));
    say('I did not catch that. Try "recommend something", "add 2 masala dosa" or "help".');
  }
})();
