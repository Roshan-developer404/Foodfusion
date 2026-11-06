import { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { quote } from '../lib/compare';
import { money } from '../lib/utils';

/* The "Where is it cheapest?" sheet that slides up after you add a dish.
   BEFORE: compare.js replaced window.addToCart with its own wrapper ("monkey-patching").
   NOW:    addToCart simply sets `compare` state in the store, and this component reacts to it. */
export default function CompareSheet() {
  const { compare, menu, delivery, cartQty, closeCompare } = useShop();
  const food = menu.find(m => m.id === compare.id);

  // auto-hide after 8 seconds; restarts each time a new dish is added (compare.n changes)
  useEffect(() => {
    if (!compare.open) return;
    const t = setTimeout(closeCompare, 8000);
    return () => clearTimeout(t);
  }, [compare.open, compare.n]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape also closes it
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && closeCompare();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // The sheet element is always in the page (so the CSS slide animation works); it has content once a dish was added.
  if (!food) return <div className="cmp" role="dialog" aria-label="Price comparison" />;

  const q = cartQty(food.id) || 1;
  const r = quote([{ id: food.id, price: food.price, q }], delivery).sort((a, b) => a.total - b.total);
  const max = r[r.length - 1].total;
  const best = r[0];
  const next = r[1].total - best.total;

  return (
    <div className={'cmp' + (compare.open ? ' show' : '')} role="dialog" aria-label="Price comparison">
      <div className="cmp-head">
        <div><small>Price check · {q} × {food.name}</small><h3>Where is it cheapest?</h3></div>
        <button className="cmp-x" aria-label="Close" onClick={closeCompare}>×</button>
      </div>
      <div className="cmp-win">
        {best.k === 'ff' ? `Order here and save ${money(next)} vs the next best app` : `${best.name} is cheapest right now`}
      </div>
      {r.map((p, i) => (
        <div key={p.k} className={'cmp-row ' + (i === 0 ? 'cmp-best' : '')} style={{ '--c': p.c, '--w': Math.round((p.total / max) * 100) + '%' }}>
          <span className="cmp-dot"></span>
          <span><b style={{ fontSize: 15 }}>{p.name}</b>{i === 0 && <span className="tag-best">Best</span>}</span>
          <b>{money(p.total)}</b>
          <div className="cmp-bar"><i></i></div>
          <em>Food {money(p.items)} · Delivery {p.del ? money(p.del) : 'Free'}{p.fee ? ' · Platform ' + money(p.fee) : ''} · {p.eta}</em>
        </div>
      ))}
      <p className="cmp-note">Estimated prices for this student demo, not live data from Swiggy or Zomato.</p>
      {/* key={compare.n} restarts the 8-second progress bar animation on every new add */}
      <div className="cmp-timer" key={compare.n}></div>
    </div>
  );
}
