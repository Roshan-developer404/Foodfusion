import { useShop } from '../context/ShopContext';
import { money } from '../lib/utils';

export default function FloatingCartBar({ goTab }) {
  const { cartCount, totals } = useShop();
  if (!cartCount) return null; // nothing in the cart -> nothing drawn

  return (
    <div id="floating-cart-bar" className="floating">
      <div>
        <b>{cartCount} item{cartCount === 1 ? '' : 's'}</b>
        <small>Subtotal <span>{money(totals.sub)}</span></small>
      </div>
      <button className="btn light" onClick={() => goTab('cart')}>View cart</button>
    </div>
  );
}
