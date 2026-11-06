import { useShop } from '../context/ShopContext';

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('ff_theme', next); } catch {}
}

export default function Header({ user, tab, goTab, onLogout }) {
  const { cartCount } = useShop();
  const nav = (id, label, extra) => (
    <button className={'nav' + (tab === id ? ' active' : '')} onClick={() => goTab(id)}>
      {label}{extra}
    </button>
  );

  return (
    <header className="header">
      <div className="wrap header-in">
        <a className="brand" href="#" onClick={e => { e.preventDefault(); goTab('menu'); }}>
          <b className="mark">F</b><span>FoodFusion</span>
        </a>

        <nav className="nav-wrap" aria-label="Main">
          {nav('menu', 'Menu')}
          {nav('cart', 'Cart ', <i className={'badge' + (cartCount > 0 ? ' on' : '')}>{cartCount}</i>)}
          {nav('orders', 'My orders')}
          {user.role === 'admin' && nav('admin', 'Admin')}
        </nav>

        <div className="header-end">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Switch between light and dark theme" title="Theme">
            <svg className="i-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            <svg className="i-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          </button>
          <div className="profile">
            <span className="avatar">{user.full_name.charAt(0).toUpperCase()}</span>
            <span className="who">
              <b>{user.full_name}</b>
              <small>{user.role === 'admin' ? 'Restaurant admin' : 'Customer'}</small>
            </span>
          </div>
          <button className="btn ghost small" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </header>
  );
}
