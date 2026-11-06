/* Simulated Swiggy / Zomato prices (moved out of compare.js, logic unchanged). */

export const PLAT = {
  swiggy: { name: 'Swiggy', c: '#FC8019', del: 35, fee: 6, eta: '28-38 min' },
  zomato: { name: 'Zomato', c: '#E23744', del: 39, fee: 5, eta: '30-40 min' }
};

const mark = (p, id, k) =>
  Math.round(p * (k === 'swiggy' ? 1.12 + (id % 5) * 0.02 : 1.16 + (id % 4) * 0.025));

// items: [{ id, price, q }]
export function quote(items, delivery) {
  const sub = items.reduce((s, x) => s + x.price * x.q, 0);
  const ffFee = delivery.threshold && sub >= delivery.threshold ? 0 : delivery.fee;
  const out = [{ k: 'ff', name: 'FoodFusion', c: '#F5B82E', items: sub, del: ffFee, fee: 0, eta: '25-35 min', total: sub + ffFee }];
  Object.entries(PLAT).forEach(([k, p]) => {
    const it = items.reduce((s, x) => s + mark(x.price, x.id, k) * x.q, 0);
    out.push({ k, name: p.name, c: p.c, items: it, del: p.del, fee: p.fee, eta: p.eta, total: it + p.del + p.fee });
  });
  return out;
}
