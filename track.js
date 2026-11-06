'use strict';
/* FoodFusion add-on: live order tracking. Load AFTER script.js (and compare.js). */
(function () {
  /* seconds each stage lasts in the demo; change these to speed up or slow down */
  const DUR = { 'PLACED': 10, 'PREPARING': 20, 'READY FOR PICKUP': 10, 'OUT FOR DELIVERY': 25 };
  const MSG = {
    'PLACED': 'The kitchen has received your order',
    'PREPARING': 'Our chef is cooking your food',
    'READY FOR PICKUP': 'Packed and waiting for the rider',
    'OUT FOR DELIVERY': 'Your rider is on the way',
    'DELIVERED': 'Delivered. Enjoy your meal!'
  };
  const isLive = o => o && DUR[o.status];
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.max(0, Math.ceil(s % 60))).padStart(2, '0')}`;

  /* progress 0..1 and seconds left for an order */
  function calc(o) {
    if (o.status === 'DELIVERED') return { p: 1, left: 0 };
    const i = STAGES.indexOf(o.status);
    const el_ = Math.min(DUR[o.status], (Date.now() - (o.sAt || Date.now())) / 1000);
    let left = DUR[o.status] - el_;
    for (let k = i + 1; k < STAGES.length - 1; k++) left += DUR[STAGES[k]];
    const total = Object.values(DUR).reduce((a, b) => a + b, 0);
    return { p: Math.min(1, 1 - left / total), left };
  }

  function etaHTML(o) {
    const c = calc(o), done = o.status === 'DELIVERED';
    return `<div class="eta-box ${done ? 'done' : ''}" id="eta-box" data-id="${o.id}" style="--r:${c.p}">
      <div class="eta-top"><span class="eta-msg">${MSG[o.status]}</span>
      <span class="eta-time" id="eta-time">${done ? 'Arrived' : mmss(c.left) + '<small>until arrival</small>'}</span></div>
      <div class="road"><span class="rest" aria-hidden="true">🍳</span><span class="home" aria-hidden="true">🏠</span><span class="rider" aria-hidden="true">🛵</span></div>
      <p class="eta-note">Demo speed: a real delivery would take about 30 minutes.</p></div>`;
  }

  /* add the tracker under the step bar whenever an order is shown */
  const origSearch = window.searchOrder;
  window.searchOrder = function () {
    origSearch();
    const o = orders.find(x => x.id === el('track-input').value.trim().toUpperCase());
    const steps = el('tracked-order-view').querySelector('.steps');
    if (o && steps && (isLive(o) || o.status === 'DELIVERED')) steps.insertAdjacentHTML('afterend', etaHTML(o));
  };

  /* an admin changing the status restarts that stage's timer */
  const origUpdate = window.updateOrderStatus;
  window.updateOrderStatus = function (id, s) {
    origUpdate(id, s);
    const o = orders.find(x => x.id === id);
    if (o) { o.sAt = Date.now(); save(); if (!el('tracked-order-view').classList.contains('hidden') && el('track-input').value.trim().toUpperCase() === id) window.searchOrder(); }
  };

  /* tick every second */
  setInterval(() => {
    if (!currentUser) return;
    const now = Date.now();
    let changed = null;
    orders.forEach(o => {
      if (!isLive(o)) return;
      if (!o.sAt) o.sAt = now;
      if (now - o.sAt >= DUR[o.status] * 1000) {
        o.status = STAGES[STAGES.indexOf(o.status) + 1];
        o.sAt = now;
        changed = o;
        toast(`${o.id}: ${STAGE_LABEL[o.status]}`);
      }
    });
    if (changed) {
      save(); renderOrders(); renderAdmin();
      const box = el('eta-box');
      if (box && el('track-input').value.trim().toUpperCase() === changed.id && !el('tracked-order-view').classList.contains('hidden')) window.searchOrder();
      return;
    }
    /* smooth update of the open tracker, no re-render */
    const box = el('eta-box');
    if (!box) return;
    const o = orders.find(x => x.id === box.dataset.id);
    if (!o || !isLive(o)) return;
    const c = calc(o);
    box.style.setProperty('--r', c.p);
    el('eta-time').innerHTML = mmss(c.left) + '<small>until arrival</small>';
  }, 1000);
})();
