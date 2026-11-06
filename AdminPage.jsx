import { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { STAGES, STAGE_LABEL } from '../data/menu';
import { money } from '../lib/utils';

const EMPTY_DISH = { name: '', category: 'Biryani', price: '', image: '', veg: true, available: true };

export default function AdminPage() {
  const { menu, orders, delivery, addFood, toggleAvail, updatePrice, deleteFood, updateOrderStatus, saveDelivery, resetDemoData } = useShop();

  const [search, setSearch] = useState('');
  const [dish, setDish] = useState(EMPTY_DISH);
  const [fee, setFee] = useState(delivery.fee);
  const [threshold, setThreshold] = useState(delivery.threshold);

  // keep the two delivery boxes in step when the saved settings change (e.g. "Reset demo data")
  useEffect(() => { setFee(delivery.fee); setThreshold(delivery.threshold); }, [delivery]);

  function handleAddFood(e) {
    e.preventDefault();
    const price = Number(dish.price);
    if (!dish.name.trim() || price <= 0) return;
    addFood({ ...dish, name: dish.name.trim(), price, image: dish.image.trim() });
    setDish(EMPTY_DISH);
  }

  /* ---- numbers are calculated from state each render ---- */
  const live = orders.filter(x => x.status !== 'CANCELLED');
  const byCat = {};
  live.forEach(o => o.items.forEach(i => {
    const c = i.category || menu.find(m => m.id === i.foodId)?.category || 'Other';
    byCat[c] = (byCat[c] || 0) + i.price * i.quantity;
  }));
  const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const max = rows[0]?.[1] || 1;

  return (
    <section className="tab-section page active">
      <div className="wrap">
        <div className="page-head"><h1>Admin</h1><p>Manage dishes, prices, availability and kitchen orders.</p></div>

        <div className="stats">
          <div><small>Menu items</small><b>{menu.length}</b></div>
          <div><small>Available now</small><b>{menu.filter(x => x.available).length}</b></div>
          <div><small>Orders placed</small><b>{orders.length}</b></div>
          <div><small>Revenue</small><b>{money(live.reduce((s, x) => s + x.total, 0))}</b></div>
        </div>

        <div className="panel">
          <h2>Revenue by category</h2>
          <div>
            {rows.length ? rows.map(([c, v]) => (
              <div className="bar-row" key={c}>
                <span>{c}</span>
                <div className="bar"><i style={{ '--w': Math.round((v / max) * 100) + '%' }}></i></div>
                <b>{money(v)}</b>
              </div>
            )) : <p className="muted">Revenue by category will appear after the first order.</p>}
          </div>
        </div>

        <div className="admin-grid">
          <div className="panel">
            <h2>Add a dish</h2>
            <form onSubmit={handleAddFood}>
              <label>Dish name<input required value={dish.name} onChange={e => setDish({ ...dish, name: e.target.value })} /></label>
              <label>Category
                <select value={dish.category} onChange={e => setDish({ ...dish, category: e.target.value })}>
                  <option>Biryani</option><option>Tiffins</option><option>Snacks</option><option>Desserts</option><option>Dinner</option>
                </select>
              </label>
              <label>Price (₹)<input type="number" min="1" required value={dish.price} onChange={e => setDish({ ...dish, price: e.target.value })} /></label>
              <label>Image URL (optional)<input type="url" placeholder="https://..." value={dish.image} onChange={e => setDish({ ...dish, image: e.target.value })} /></label>
              <label className="check"><input type="checkbox" checked={dish.veg} onChange={e => setDish({ ...dish, veg: e.target.checked })} /> Vegetarian</label>
              <label className="check"><input type="checkbox" checked={dish.available} onChange={e => setDish({ ...dish, available: e.target.checked })} /> Available now</label>
              <button className="btn primary wide">Add dish</button>
            </form>

            <hr />
            <h2>Delivery settings</h2>
            <label>Delivery fee (₹)<input type="number" min="0" value={fee} onChange={e => setFee(e.target.value)} /></label>
            <label>Free delivery above (₹)<input type="number" min="0" value={threshold} onChange={e => setThreshold(e.target.value)} /></label>
            <button className="btn outline wide" onClick={() => saveDelivery(fee, threshold)}>Save settings</button>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2>Menu management</h2>
              <input className="admin-search" placeholder="Find a dish" aria-label="Find a dish" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Dish</th><th>Price</th><th>Availability</th><th><span className="sr">Action</span></th></tr></thead>
                <tbody>
                  {menu.filter(x => x.name.toLowerCase().includes(search.toLowerCase())).map(x => (
                    <tr key={x.id}>
                      <td>{x.name}</td>
                      <td>
                        {/* defaultValue + onBlur = save when you finish typing (like the old onchange).
                            key={x.price} makes the box refresh if the price changes elsewhere. */}
                        <input className="price-edit" type="number" min="1" key={x.price} defaultValue={x.price}
                               aria-label={`Price of ${x.name}`}
                               onBlur={e => Number(e.target.value) !== x.price && updatePrice(x.id, e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()} />
                      </td>
                      <td>
                        <button className={'avail-btn ' + (x.available ? '' : 'off')} onClick={() => toggleAvail(x.id)}>
                          {x.available ? 'Available' : 'Sold out'}
                        </button>
                      </td>
                      <td><button className="link danger" onClick={() => deleteFood(x.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Kitchen orders</h2>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.length ? orders.map(o => (
                  <tr key={o.id}>
                    <td><b>{o.id}</b></td>
                    <td>{o.customer}</td>
                    <td>{o.items.map(x => <div key={x.foodId}>{x.name} × {x.quantity}</div>)}</td>
                    <td>{money(o.total)}</td>
                    <td>
                      <select aria-label={`Status of ${o.id}`} value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}>
                        {[...STAGES, 'CANCELLED'].map(s => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                )) : <tr><td colSpan="5">No orders yet. New orders appear here.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <button className="link danger" onClick={resetDemoData}>Reset demo data</button>
      </div>
    </section>
  );
}
