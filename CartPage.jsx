import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { imgFallback, money } from '../lib/utils';
import SavingsBanner from '../components/SavingsBanner';

export default function CartPage({ goTab, onPlaced }) {
  const { cart, delivery, promo, totals: t, changeQty, removeItem, clearCart, applyPromo, placeOrder, toast } = useShop();

  const [promoText, setPromoText] = useState('');
  const [form, setForm] = useState({ customer: '', phone: '', address: '', payment: 'Cash on Delivery' });
  // one small helper updates any one field of the form object
  const field = name => ({ value: form[name], onChange: e => setForm({ ...form, [name]: e.target.value }) });

  function handleSubmit(e) {
    e.preventDefault();
    if (!cart.length) return;

    const phone = form.phone.trim();
    if (!/^[6-9]\d{9}$/.test(phone)) return toast('Enter a valid 10-digit mobile number');

    const order = placeOrder({
      customer: form.customer.trim(),
      phone,
      address: form.address.trim(),
      payment: form.payment
    });
    setForm({ customer: '', phone: '', address: '', payment: 'Cash on Delivery' });
    onPlaced(order); // App shows the "Order placed" popup
  }

  // free-delivery progress bar
  const left = delivery.threshold - t.sub;
  const pct = Math.min(100, Math.round((t.sub / delivery.threshold) * 100));

  return (
    <section className="tab-section page active">
      <div className="wrap">
        <div className="page-head"><h1>Your cart</h1><p>Review your picks, then tell us where to deliver.</p></div>

        <div className="checkout-grid">
          <div className="panel">
            <div className="panel-head">
              <h2>Selected dishes</h2>
              <button className="link danger" onClick={clearCart}>Clear cart</button>
            </div>

            <div id="free-progress">
              {cart.length > 0 && delivery.threshold > 0 && (
                <>
                  <span>{left > 0 ? <>Add <b>{money(left)}</b> more for free delivery</> : 'You have free delivery'}</span>
                  <div className="meter"><i style={{ '--p': pct + '%' }}></i></div>
                </>
              )}
            </div>

            <div>
              {cart.length ? (
                cart.map(x => (
                  <div className="cart-row" key={x.foodId}>
                    <img src={x.image} alt="" onError={imgFallback} />
                    <div className="cart-name">
                      <b>{x.name}</b><small>{money(x.price)} each</small>
                      <div className="stepper" role="group" aria-label={`Quantity of ${x.name}`}>
                        <button onClick={() => changeQty(x.foodId, -1)} aria-label="Remove one">−</button>
                        <b>{x.quantity}</b>
                        <button onClick={() => changeQty(x.foodId, 1)} aria-label="Add one">+</button>
                      </div>
                    </div>
                    <div className="cart-end">
                      <b>{money(x.price * x.quantity)}</b>
                      <button className="link danger" onClick={() => removeItem(x.foodId)}>Remove</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty">
                  <h3>Your cart is empty</h3>
                  <p>Add a dish from the menu and it will show up here.</p>
                  <button className="btn outline" onClick={() => goTab('menu')}>Browse the menu</button>
                </div>
              )}
            </div>
          </div>

          <aside className="panel bill">
            <h2>Bill summary</h2>
            <div className="promo">
              <input placeholder="Promo code" aria-label="Promo code" value={promoText}
                     onChange={e => setPromoText(e.target.value)} />
              <button className="btn outline" onClick={() => applyPromo(promoText)}>Apply</button>
            </div>
            <SavingsBanner />
            <p className="hint">Try FUSION10 for 10% off, or FREE30 for free delivery.</p>

            <div className="bill-lines">
              <div><span>Subtotal</span><b>{money(t.sub)}</b></div>
              <div><span>Delivery fee</span><b>{t.fee ? money(t.fee) : cart.length ? 'Free' : money(0)}</b></div>
              {t.discount > 0 && <div className="discount"><span>Discount</span><b>-{money(t.discount)}</b></div>}
              <div className="grand"><span>Total payable</span><b>{money(t.total)}</b></div>
            </div>

            <form onSubmit={handleSubmit}>
              <h3>Delivery details</h3>
              <label>Full name<input required placeholder="Your name" autoComplete="name" {...field('customer')} /></label>
              <label>Phone number
                <input required inputMode="numeric" maxLength={10} pattern="[6-9][0-9]{9}"
                       placeholder="10-digit mobile number" autoComplete="tel-national" {...field('phone')} />
              </label>
              <label>Delivery address
                <textarea required rows={3} placeholder="Hostel or flat, street and landmark" autoComplete="street-address" {...field('address')} />
              </label>
              <label>Payment method
                <select {...field('payment')}>
                  <option>Cash on Delivery</option><option>UPI (demo only)</option><option>Card (demo only)</option>
                </select>
              </label>
              <button className="btn primary wide" type="submit" disabled={!cart.length}>Place order</button>
              <small className="muted">Demo checkout. No real payment is collected.</small>
            </form>
          </aside>
        </div>
      </div>
    </section>
  );
}
