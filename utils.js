/* Small helpers that were globals in script.js. Now they are imported where used. */

export const money = n =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// localStorage helpers (wrapped in try/catch because private mode can block storage)
export const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
};

export const put = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

/* If a food photo fails to load, swap in a yellow tile with the first letter.
   Used as:  <img onError={imgFallback} />  */
export function imgFallback(e) {
  const img = e.currentTarget;
  if (img.dataset.fb) return; // only try once, avoids an endless loop
  img.dataset.fb = '1';
  const letter = ((img.alt || 'F').trim()[0] || 'F').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#FFD76A"/><stop offset="1" stop-color="#E0861C"/></radialGradient></defs><rect width="200" height="200" fill="url(#g)"/><text x="100" y="132" font-size="100" font-weight="800" text-anchor="middle" fill="#12372A" fill-opacity=".85" font-family="Georgia,serif">${letter}</text></svg>`;
  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* Bill maths as a pure function: same inputs always give the same output. */
export function calcTotals(cart, delivery, promo) {
  const sub = cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const fee = cart.length ? (delivery.threshold && sub >= delivery.threshold ? 0 : delivery.fee) : 0;
  const discount = promo === 'FUSION10' ? Math.round(sub * 0.1) : promo === 'FREE30' ? fee : 0;
  return { sub, fee, discount, total: sub + fee - discount };
}
