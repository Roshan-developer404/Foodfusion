import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { ShopProvider, useShop } from './context/ShopContext';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';
import FloatingCartBar from './components/FloatingCartBar';
import ReceiptModal from './components/ReceiptModal';
import CompareSheet from './components/CompareSheet';
import FusionBot from './components/FusionBot';
import Toasts from './components/Toasts';

/* App decides ONE thing: show the login page, or the shop.
   BEFORE: el('auth-view').classList.add('hidden') / el('app-view').classList.remove('hidden')
   NOW:    a plain if/else on the `user` variable. */
export default function App() {
  const auth = useAuth();

  if (auth.booting) return null; // brief moment while we check for a saved session

  if (!auth.user) return <LoginPage auth={auth} />;

  return (
    <ShopProvider user={auth.user}>
      <Shop user={auth.user} signOut={auth.signOut} />
    </ShopProvider>
  );
}

/* The signed-in part of the site. */
function Shop({ user, signOut }) {
  const { toast } = useShop();

  // which "page" is showing (BEFORE: switchTab() toggling .active classes)
  const [tab, setTab] = useState(user.role === 'admin' ? 'admin' : 'menu');
  const [receipt, setReceipt] = useState(null);      // the order shown in the "Order placed" popup
  const [trackInput, setTrackInput] = useState('');  // text in the "track order" box
  const [trackQuery, setTrackQuery] = useState('');  // the ID that was actually searched

  function goTab(next) {
    if (next === 'admin' && user.role !== 'admin') next = 'menu'; // customers can never open Admin
    setTab(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function openTracker(id) {
    setTrackInput(id);
    setTrackQuery(id.trim().toUpperCase());
    goTab('orders');
  }

  async function handleLogout() {
    try {
      localStorage.setItem('ff_cart_v5', '[]'); // the next person on this browser must not see this cart
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err.message);
      toast('Could not sign out. Please try again.');
    }
  }

  return (
    <div id="app-view">
      <Header user={user} tab={tab} goTab={goTab} onLogout={handleLogout} />

      <main>
        {/* The menu stays mounted (just hidden) so your search box, filters and the hero animation survive tab changes */}
        <MenuPage active={tab === 'menu'} goTab={goTab} />

        {/* The other pages exist only while open: this is "conditional rendering" */}
        {tab === 'cart' && (
          <CartPage goTab={goTab} onPlaced={order => setReceipt(order)} />
        )}
        {tab === 'orders' && (
          <OrdersPage
            goTab={goTab}
            input={trackInput} setInput={setTrackInput}
            query={trackQuery} setQuery={setTrackQuery}
          />
        )}
        {tab === 'admin' && user.role === 'admin' && <AdminPage />}
      </main>

      <footer className="footer">
        <div className="wrap foot-in">
          <a className="brand" href="#" onClick={e => { e.preventDefault(); goTab('menu'); }}>
            <b className="mark">F</b><span>FoodFusion</span>
          </a>
          <p>Good food brings people together.</p>
        </div>
      </footer>

      {tab === 'menu' && <FloatingCartBar goTab={goTab} />}

      <ReceiptModal
        order={receipt}
        onClose={() => setReceipt(null)}
        onTrack={id => { setReceipt(null); openTracker(id); }}
      />
      <CompareSheet />
      <FusionBot goTab={goTab} openTracker={openTracker} />
      <Toasts />
    </div>
  );
}
