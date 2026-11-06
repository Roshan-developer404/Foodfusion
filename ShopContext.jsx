import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { DEFAULT_MENU, NONVEG, STAGES, STAGE_LABEL, pics, photo } from '../data/menu';
import { calcTotals, load, put } from '../lib/utils';
import { useSyncedState } from '../hooks/useSyncedState';

/* ---------------------------------------------------------------
   The "shop store": menu, cart, orders, delivery settings, toasts.

   BEFORE: `let menu`, `let cart`, `let orders` ... as globals, and after every change
           you had to remember to call renderCart(), renderMenu(), renderAdmin() ...
   NOW:    this is state. Change it with a setter and every component that
           shows it re-draws itself automatically.

   Context lets any component read it with useShop() (no prop-drilling).
   --------------------------------------------------------------- */

const ShopContext = createContext(null);
export const useShop = () => useContext(ShopContext);

// how many seconds each delivery stage lasts in the demo (from track.js)
export const STAGE_SECONDS = { 'PLACED': 10, 'PREPARING': 20, 'READY FOR PICKUP': 10, 'OUT FOR DELIVERY': 25 };

export function ShopProvider({ user, children }) {
  /* ---------- state (loaded once from localStorage) ---------- */
  const [menu, setMenu] = useState(() => {
    const m = load('ff_menu_v4', DEFAULT_MENU);
    return m.map(x => (typeof x.veg === 'boolean' ? x : { ...x, veg: !NONVEG.test(x.name) }));
  });
  const [orders, setOrders, ordersRef] = useSyncedState(() => load('ff_orders_v4', []));
  const [cart, setCart, cartRef] = useSyncedState(() => {
    const ids = new Set(load('ff_menu_v4', DEFAULT_MENU).map(m => m.id));
    return load('ff_cart_v5', []).filter(c => ids.has(c.foodId));
  });
  const [promo, setPromo, promoRef] = useSyncedState('');
  const [nextOrder, setNextOrder, nextOrderRef] = useSyncedState(() => Number(load('ff_next_v4', 1001)));
  const [delivery, setDelivery] = useState(() => ({ fee: 30, threshold: 499, ...load('ff_delivery_v4', {}) }));
  const [toasts, setToasts] = useState([]);
  const [compare, setCompare] = useState({ id: null, n: 0, open: false }); // price-comparison sheet

  /* ---------- save to localStorage whenever something changes ---------- */
  useEffect(() => put('ff_menu_v4', menu), [menu]);
  useEffect(() => put('ff_orders_v4', orders), [orders]);
  useEffect(() => put('ff_next_v4', nextOrder), [nextOrder]);
  useEffect(() => put('ff_delivery_v4', delivery), [delivery]);
  useEffect(() => put('ff_cart_v5', cart), [cart]);

  /* ---------- toast ---------- */
  function toast(text) {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, text }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  }

  /* ---------- derived values (calculated, never stored) ---------- */
  const cartCount = cart.reduce((s, x) => s + x.quantity, 0);
  const totals = calcTotals(cart, delivery, promo);
  const canSeeOrder = o => user.role === 'admin' || o.userId === user.id;
  const myOrders = orders.filter(canSeeOrder);
  const cartQty = id => cart.find(c => c.foodId === id)?.quantity || 0;

  /* ---------- cart actions ---------- */
  function addToCart(id, count = 1) {
    const food = menu.find(x => x.id === id);
    if (!food || !food.available) return;

    setCart(prev => {
      const found = prev.find(x => x.foodId === id);
      if (found) return prev.map(x => (x.foodId === id ? { ...x, quantity: x.quantity + count } : x));
      return [...prev, { foodId: id, name: food.name, category: food.category, price: food.price, image: food.image, quantity: count }];
    });
    setCompare(c => ({ id, n: c.n + 1, open: true })); // slide up the price comparison
  }

  function changeQty(id, delta) {
    setCart(prev =>
      prev.map(x => (x.foodId === id ? { ...x, quantity: x.quantity + delta } : x)).filter(x => x.quantity >= 1)
    );
  }

  function removeItem(id) {
    setCart(prev => prev.filter(x => x.foodId !== id));
    toast('Removed from your cart');
  }

  function clearCart() {
    if (!cartRef.current.length) return;
    setCart([]);
    setPromo('');
    toast('Cart cleared');
  }

  // returns true / false so the chatbot can react to it
  function applyPromo(raw) {
    const code = raw.trim().toUpperCase();
    const ok = ['FUSION10', 'FREE30'].includes(code);
    setPromo(ok ? code : '');
    toast(ok ? `${code} applied` : 'That promo code is not valid');
    return ok;
  }

  /* ---------- orders ---------- */
  function placeOrder({ customer, phone, address, payment }) {
    const t = calcTotals(cartRef.current, delivery, promoRef.current);
    const order = {
      id: 'ORD-' + nextOrderRef.current,
      userId: user.id,
      customer,
      phone,
      address,
      payment,
      items: cartRef.current.map(x => ({ ...x })),
      total: t.total,
      status: 'PLACED',
      sAt: Date.now(),
      created: new Date().toLocaleString('en-IN')
    };
    setNextOrder(n => n + 1);
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setPromo('');
    return order;
  }

  function cancelOrder(id) {
    setOrders(prev => prev.map(o => (o.id === id && o.status === 'PLACED' ? { ...o, status: 'CANCELLED' } : o)));
    toast('Order cancelled');
  }

  // admin changes a status by hand -> restart that stage's timer
  function updateOrderStatus(id, status) {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status, sAt: Date.now() } : o)));
  }

  /* ---------- admin actions ---------- */
  function addFood({ name, category, price, veg, image, available }) {
    setMenu(prev => [
      ...prev,
      {
        id: Math.max(0, ...prev.map(x => x.id)) + 1,
        name, category, price,
        description: 'Freshly prepared in our kitchen.',
        veg, available,
        image: image || photo(pics[category][0])
      }
    ]);
    toast(`${name} added to the menu`);
  }

  function toggleAvail(id) {
    setMenu(prev => prev.map(x => (x.id === id ? { ...x, available: !x.available } : x)));
  }

  function updatePrice(id, value) {
    const n = Number(value);
    if (!(n > 0)) return;
    setMenu(prev => prev.map(x => (x.id === id ? { ...x, price: n } : x)));
    setCart(prev => prev.map(c => (c.foodId === id ? { ...c, price: n } : c)));
    toast('Price updated');
  }

  function deleteFood(id) {
    if (!confirm('Delete this menu item?')) return;
    setMenu(prev => prev.filter(x => x.id !== id));
    setCart(prev => prev.filter(x => x.foodId !== id));
  }

  function saveDelivery(fee, threshold) {
    setDelivery({ fee: Math.max(0, Number(fee) || 0), threshold: Math.max(0, Number(threshold) || 0) });
    toast('Delivery settings saved');
  }

  function resetDemoData() {
    if (!confirm('Reset all FoodFusion demo data?')) return;
    setMenu(structuredClone(DEFAULT_MENU));
    setOrders([]);
    setCart([]);
    setPromo('');
    setNextOrder(1001);
    setDelivery({ fee: 30, threshold: 499 });
    toast('Demo data reset');
  }

  /* ---------- live order tracking (was track.js: setInterval every second) ---------- */
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      let changed = false;
      const advanced = [];

      const next = ordersRef.current.map(o => {
        if (!STAGE_SECONDS[o.status]) return o;               // delivered / cancelled: nothing to do
        if (!o.sAt) { changed = true; return { ...o, sAt: now }; }
        if (now - o.sAt >= STAGE_SECONDS[o.status] * 1000) {
          changed = true;
          const status = STAGES[STAGES.indexOf(o.status) + 1];
          advanced.push(`${o.id}: ${STAGE_LABEL[status]}`);
          return { ...o, status, sAt: now };
        }
        return o;
      });

      if (changed) setOrders(next);
      advanced.forEach(toast);
    }, 1000);

    return () => clearInterval(timer); // cleanup when the provider goes away (sign out)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user, menu, cart, orders, myOrders, delivery, promo, toasts, compare,
    cartCount, totals, cartQty,
    getCart: () => cartRef.current, getPromo: () => promoRef.current,
    toast, addToCart, changeQty, removeItem, clearCart, applyPromo,
    placeOrder, cancelOrder, updateOrderStatus,
    addFood, toggleAvail, updatePrice, deleteFood, saveDelivery, resetDemoData,
    closeCompare: () => setCompare(c => ({ ...c, open: false }))
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
