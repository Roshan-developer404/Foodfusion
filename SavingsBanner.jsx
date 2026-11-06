import { useShop } from '../context/ShopContext';
import { quote } from '../lib/compare';
import { money } from '../lib/utils';

/* "You save up to ₹X vs Swiggy / Zomato" (was renderBanner() in compare.js,
   which had to be re-called by monkey-patching window.renderCart). */
export default function SavingsBanner() {
  const { cart, delivery } = useShop();
  if (!cart.length) return null;

  const r = quote(cart.map(c => ({ id: c.foodId, price: c.price, q: c.quantity })), delivery);
  const ff = r[0].total;
  const others = r.slice(1);
  const worst = Math.max(...others.map(o => o.total));
  const best = Math.min(...others.map(o => o.total));

  return (
    <div id="save-banner" className="save-banner">
      {ff <= best ? (
        <>
          <span>You save up to</span><b>{money(worst - ff)}</b>
          <small>vs Swiggy {money(r[1].total)} · Zomato {money(r[2].total)} for this same cart</small>
        </>
      ) : (
        <>
          <span>Swiggy {money(r[1].total)} · Zomato {money(r[2].total)}</span>
          <small>Your FoodFusion total is {money(ff)}</small>
        </>
      )}
    </div>
  );
}
