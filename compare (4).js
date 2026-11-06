'use strict';
/* FoodFusion add-on. Load AFTER script.js. Prices for Swiggy/Zomato are simulated estimates. */
(function () {
  const PLAT = {
    swiggy: { name: 'Swiggy', c: '#FC8019', del: 35, fee: 6, eta: '28-38 min' },
    zomato: { name: 'Zomato', c: '#E23744', del: 39, fee: 5, eta: '30-40 min' }
  };
  const mark = (p, id, k) => Math.round(p * (k === 'swiggy' ? 1.12 + (id % 5) * .02 : 1.16 + (id % 4) * .025));

  function quote(items) {
    const sub = items.reduce((s, x) => s + x.price * x.q, 0);
    const ffFee = delivery.threshold && sub >= delivery.threshold ? 0 : delivery.fee;
    const out = [{ k: 'ff', name: 'FoodFusion', c: '#F5B82E', items: sub, del: ffFee, fee: 0, eta: '25-35 min', total: sub + ffFee }];
    Object.entries(PLAT).forEach(([k, p]) => {
      const it = items.reduce((s, x) => s + mark(x.price, x.id, k) * x.q, 0);
      out.push({ k, name: p.name, c: p.c, items: it, del: p.del, fee: p.fee, eta: p.eta, total: it + p.del + p.fee });
    });
    return out;
  }

  /* ---------- comparison sheet ---------- */
  const sheet = document.createElement('div');
  sheet.className = 'cmp';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-label', 'Price comparison');
  document.body.append(sheet);
  let timer;
  const hide = () => { sheet.classList.remove('show'); clearTimeout(timer); };

  function openCompare(id) {
    const x = menu.find(m => m.id === id);
    if (!x || !x.available) return;
    const q = cartQty(id) || 1;
    const r = quote([{ id, price: x.price, q }]).sort((a, b) => a.total - b.total);
    const max = r[r.length - 1].total, best = r[0];
    const next = r[1].total - best.total;
    sheet.innerHTML = `
      <div class="cmp-head"><div><small>Price check · ${q} × ${safe(x.name)}</small><h3>Where is it cheapest?</h3></div><button class="cmp-x" aria-label="Close">×</button></div>
      <div class="cmp-win">${best.k === 'ff' ? `Order here and save ${money(next)} vs the next best app` : `${best.name} is cheapest right now`}</div>
      ${r.map((p, i) => `<div class="cmp-row ${i === 0 ? 'cmp-best' : ''}" style="--c:${p.c};--w:${Math.round(p.total / max * 100)}%">
        <span class="cmp-dot"></span><span><b style="font-size:15px">${p.name}</b>${i === 0 ? '<span class="tag-best">Best</span>' : ''}</span><b>${money(p.total)}</b>
        <div class="cmp-bar"><i></i></div>
        <em>Food ${money(p.items)} · Delivery ${p.del ? money(p.del) : 'Free'}${p.fee ? ' · Platform ' + money(p.fee) : ''} · ${p.eta}</em></div>`).join('')}
      <p class="cmp-note">Estimated prices for this student demo, not live data from Swiggy or Zomato.</p>
      <div class="cmp-timer"></div>`;
    sheet.querySelector('.cmp-x').onclick = hide;
    sheet.classList.remove('show'); void sheet.offsetWidth; sheet.classList.add('show');
    clearTimeout(timer); timer = setTimeout(hide, 8000);
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });

  /* hook: every time a dish is added */
  const origAdd = window.addToCart;
  window.addToCart = function (id) { origAdd(id); openCompare(id); };

  /* ---------- cart savings banner ---------- */
  const banner = document.createElement('div');
  banner.id = 'save-banner';
  el('promo-input').closest('.promo').after(banner);

  function renderBanner() {
    if (!cart.length) { banner.innerHTML = ''; return; }
    const r = quote(cart.map(c => ({ id: c.foodId, price: c.price, q: c.quantity })));
    const ff = r[0].total, others = r.slice(1);
    const worst = Math.max(...others.map(o => o.total)), best = Math.min(...others.map(o => o.total));
    banner.className = 'save-banner';
    banner.innerHTML = ff <= best
      ? `<span>You save up to</span><b>${money(worst - ff)}</b><small>vs Swiggy ${money(r[1].total)} · Zomato ${money(r[2].total)} for this same cart</small>`
      : `<span>Swiggy ${money(r[1].total)} · Zomato ${money(r[2].total)}</span><small>Your FoodFusion total is ${money(ff)}</small>`;
  }
  const origRender = window.renderCart;
  window.renderCart = function () { origRender(); renderBanner(); };
  renderBanner();

  /* ---------- Surprise me ---------- */
  const cta = document.querySelector('.hero-cta');
  const btn = document.createElement('button');
  btn.className = 'btn surprise big';
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/></svg> Surprise me';
  btn.onclick = () => {
    const pool = menu.filter(m => m.available);
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    btn.classList.add('spin'); setTimeout(() => btn.classList.remove('spin'), 650);
    toast(`Today's lucky dish: ${pick.name}`);
    window.addToCart(pick.id);
  };
  cta.insertBefore(btn, cta.querySelector('.free-note'));
})();
