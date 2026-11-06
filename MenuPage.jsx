import { useEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/menu';
import { imgFallback, money } from '../lib/utils';
import DishCard, { PlusIcon } from '../components/DishCard';

export default function MenuPage({ active }) {
  const { menu, delivery, addToCart, toast } = useShop();

  // Filters are state. BEFORE they were read from the DOM: el('search-input').value
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [vegOnly, setVegOnly] = useState(false);
  const [availOnly, setAvailOnly] = useState(false);
  const [category, setCategory] = useState('All');

  const searchRef = useRef(null);
  const menuAreaRef = useRef(null);
  const [spin, setSpin] = useState(false);

  // press "/" to jump to the search box
  useEffect(() => {
    if (!active) return;
    const onKey = e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
      if (e.key === '/' && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  /* ---- the visible list is CALCULATED from menu + filters on every render ---- */
  const q = search.trim().toLowerCase();
  const list = menu.filter(x =>
    (category === 'All' || x.category === category) &&
    (!availOnly || x.available) &&
    (!vegOnly || x.veg) &&
    `${x.name} ${x.category} ${x.description}`.toLowerCase().includes(q)
  );
  if (sort === 'low') list.sort((a, b) => a.price - b.price);
  if (sort === 'high') list.sort((a, b) => b.price - a.price);
  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

  function clearFilters() {
    setSearch(''); setAvailOnly(false); setVegOnly(false); setSort('default'); setCategory('All');
  }

  function surpriseMe() {
    const pool = menu.filter(m => m.available);
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSpin(true);
    setTimeout(() => setSpin(false), 650);
    toast(`Today's lucky dish: ${pick.name}`);
    addToCart(pick.id);
  }

  const chef = menu.find(x => x.id === 2) || menu[0];

  return (
    <section className={'tab-section' + (active ? ' active' : '')}>
      <div className="hero enter">
        <span className="glyph" aria-hidden="true">రుచి</span>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 className="rise" style={{ '--d': '0ms' }}>Hot biryani, crisp dosa, at your door.</h1>
            <p className="rise" style={{ '--d': '90ms' }}>
              <span>{menu.length}</span> dishes across biryani, tiffins, snacks, desserts and dinner. Cooked when you order, tracked until it arrives.
            </p>
            <div className="hero-cta rise" style={{ '--d': '180ms' }}>
              <button className="btn dark big" onClick={() => menuAreaRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                Browse the menu
              </button>
              <button className={'btn surprise big' + (spin ? ' spin' : '')} onClick={surpriseMe}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" /></svg> Surprise me
              </button>
              <span className="free-note">
                {delivery.threshold ? `Free delivery above ${money(delivery.threshold)}` : 'Delivered hot to your door'}
              </span>
            </div>
          </div>

          {chef && (
            <div className="plate rise" style={{ '--d': '120ms' }}>
              <div className="plate-spin">
                <div className="plate-rim"></div>
                {/* key={chef.image}: a new image gets a fresh <img>, so the fallback logic runs again */}
                <img key={chef.image} className="plate-food" src={chef.image} alt={chef.name} onError={imgFallback} />
              </div>
              <div className="chip">
                <div><small>Chef's pick</small><b>{chef.name}</b><span className="price">{money(chef.price)}</span></div>
                {chef.available && (
                  <button className="add-btn" onClick={() => addToCart(chef.id)}><PlusIcon /> Add</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="wrap">
        <ul className="facts">
          <li><b>{menu.length}</b> dishes</li>
          <li><b>5</b> categories</li>
          <li>Cooked <b>to order</b></li>
          <li><b>Live</b> order tracking</li>
        </ul>
      </div>

      <div className="wrap menu-area" ref={menuAreaRef}>
        <div className="section-head">
          <h2>The menu</h2>
          <p className="muted" aria-live="polite">Showing {list.length} of {menu.length} dishes</p>
        </div>

        <div className="sticky-tools">
          <div className="toolbar">
            <label className="search">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input ref={searchRef} type="search" placeholder="Search dishes  ( press / )" aria-label="Search dishes"
                     value={search} onChange={e => setSearch(e.target.value)} />
            </label>
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort dishes">
              <option value="default">Recommended</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
            <label className="switch">
              <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
              <span className="track-s"></span> Veg only
            </label>
            <label className="switch">
              <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)} />
              <span className="track-s"></span> Available now
            </label>
          </div>

          <div className="categories" role="tablist" aria-label="Categories">
            {CATEGORIES.map(c => {
              const n = c === 'All' ? menu.length : menu.filter(x => x.category === c).length;
              return (
                <button key={c} className={'cat ' + (category === c ? 'selected' : '')} role="tab"
                        aria-selected={category === c} onClick={() => setCategory(c)}>
                  {c === 'All' ? 'All dishes' : c}<span>{n}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="food-grid">
          {list.length ? (
            list.map(x => <DishCard key={x.id} food={x} />)
          ) : (
            <div className="empty">
              <h3>No dishes match</h3>
              <p>Try a different search, or clear the filters.</p>
              <button className="btn outline" onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
