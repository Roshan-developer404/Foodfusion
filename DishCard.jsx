import { useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { imgFallback, money } from '../lib/utils';

export const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
);

/* Add button <-> quantity stepper for ONE dish.
   BEFORE: refreshActions() looped over every [data-act] node and rewrote its innerHTML,
           and keepFocus() hunted for the right button afterwards.
   NOW:    this component just draws itself from the cart quantity. */
function DishAction({ food }) {
  const { cartQty, addToCart, changeQty } = useShop();
  const plusBtn = useRef(null);
  const focusPlus = useRef(false);
  const q = cartQty(food.id);

  // keyboard users: after pressing "Add", keep focus on the new "+" button
  useEffect(() => {
    if (q > 0 && focusPlus.current) {
      plusBtn.current?.focus({ preventScroll: true });
      focusPlus.current = false;
    }
  }, [q]);

  if (!food.available) return <span className="muted-tag">Unavailable</span>;

  if (q) {
    return (
      <div className="stepper" role="group" aria-label={`Quantity of ${food.name}`}>
        <button onClick={() => changeQty(food.id, -1)} aria-label="Remove one">−</button>
        <b>{q}</b>
        <button ref={plusBtn} onClick={() => changeQty(food.id, 1)} aria-label="Add one">+</button>
      </div>
    );
  }

  return (
    <button className="add-btn" aria-label={`Add ${food.name} to cart`}
            onClick={() => { focusPlus.current = true; addToCart(food.id); }}>
      <PlusIcon /> Add
    </button>
  );
}

/* A "component" = a function that returns HTML-looking code (JSX).
   BEFORE: dishCard(x) returned a long template string with ${...} holes.
   NOW:    the same markup, but safe by default: React escapes text, so safe() is not needed. */
export default function DishCard({ food }) {
  return (
    <article className={'dish ' + (food.available ? '' : 'is-out')}>
      <span className={'vm ' + (food.veg ? '' : 'nonveg')} role="img" aria-label={food.veg ? 'Vegetarian' : 'Non-vegetarian'} />
      {!food.available && <span className="out-tag">Sold out</span>}
      <div className="dish-img">
        <img loading="lazy" src={food.image} alt={food.name} onError={imgFallback} />
      </div>
      <h3>{food.name}</h3>
      <p>{food.description}</p>
      <div className="dish-foot">
        <b className="price">{money(food.price)}</b>
        <div><DishAction food={food} /></div>
      </div>
    </article>
  );
}
