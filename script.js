
'use strict';

/* =========================================================
   FoodFusion — data
   ========================================================= */

const photo = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=720&q=82`;

const pics = {
  Biryani: ['photo-1563379091339-03246963d96c','photo-1633945274405-b6c8069047b0','photo-1589302168068-964664d93dc0','photo-1512058564366-18510be2db19','photo-1603894584373-5ac82b2ae398','photo-1567188040759-fb8a883dc6d8','photo-1631515243349-e0cb75fb8d3a','photo-1599043513900-ed6fe01d3833','photo-1563379091339-03246963d96c','photo-1633945274405-b6c8069047b0'],
  Tiffins: ['photo-1589301760014-d929f3979dbc','photo-1630383249896-424e482df921','photo-1668236543090-82eba5ee5976','photo-1601050690597-df0568f70950','photo-1626132647523-66f5bf380027','photo-1630383249896-424e482df921','photo-1589301760014-d929f3979dbc','photo-1668236543090-82eba5ee5976','photo-1601050690597-df0568f70950','photo-1626132647523-66f5bf380027'],
  Snacks: ['photo-1601050690597-df0568f70950','photo-1604908176997-125f25cc6f3d','photo-1626777552726-4a6b54c97e46','photo-1567337710282-00832b415979','photo-1601050690117-94f5f6fa8bd7','photo-1604908176997-125f25cc6f3d','photo-1626777552726-4a6b54c97e46','photo-1567337710282-00832b415979','photo-1601050690117-94f5f6fa8bd7','photo-1601050690597-df0568f70950'],
  Desserts: ['photo-1578985545062-69928b1d9587','photo-1563805042-7684c019e1cb','photo-1488477181946-6428a0291777','photo-1563805042-7684c019e1cb','photo-1578985545062-69928b1d9587','photo-1563805042-7684c019e1cb','photo-1488477181946-6428a0291777','photo-1578985545062-69928b1d9587','photo-1563805042-7684c019e1cb','photo-1488477181946-6428a0291777'],
  Dinner: Array(10).fill('photo-1547592180-85f173990554')
};

const raw = [
  ['Chicken Dum Biryani','Biryani',180,'Fragrant basmati rice layered with tender chicken.'],
  ['Hyderabadi Mutton Biryani','Biryani',280,'Slow-cooked dum biryani with aromatic spices.'],
  ['Vijayawada Boneless Biryani','Biryani',220,'Andhra-style spicy boneless chicken biryani.'],
  ['Paneer Tikka Biryani','Biryani',190,'Smoky paneer tikka with long-grain rice.'],
  ['Egg Dum Biryani','Biryani',150,'Boiled eggs tucked into masala rice.'],
  ['Prawns Biryani','Biryani',260,'Coastal-style prawns and fragrant rice.'],
  ['Veg Special Biryani','Biryani',150,'Seasonal vegetables and signature masala.'],
  ['Mushroom Biryani','Biryani',170,'Mushrooms cooked with aromatic basmati rice.'],
  ['Paneer Biryani','Biryani',180,'Soft paneer cubes with rich dum flavours.'],
  ['Ulavacharu Chicken Biryani','Biryani',250,'A signature Andhra-style biryani.'],

  ['Masala Dosa','Tiffins',80,'Crisp dosa with spiced potato filling.'],
  ['Plain Dosa','Tiffins',55,'Golden, paper-thin dosa with chutneys.'],
  ['Ghee Karam Dosa','Tiffins',95,'Dosa finished with ghee and spicy karam.'],
  ['Onion Rava Dosa','Tiffins',90,'Lacy semolina dosa with onion and chilli.'],
  ['Idli Sambar (3 pcs)','Tiffins',60,'Soft idlis with sambar and chutney.'],
  ['Medu Vada (2 pcs)','Tiffins',65,'Crispy outside, fluffy inside lentil vada.'],
  ['Mysore Bonda','Tiffins',55,'Soft, fluffy South Indian fritters.'],
  ['Pesarattu','Tiffins',85,'Andhra green-gram dosa with ginger chutney.'],
  ['Poori with Aloo Curry','Tiffins',90,'Puffed pooris with potato curry.'],
  ['Pongal with Chutney','Tiffins',75,'Peppery rice-lentil pongal.'],

  ['Chicken 65','Snacks',170,'Crispy, spicy boneless chicken bites.'],
  ['Paneer 65','Snacks',150,'Golden paneer tossed in lively masala.'],
  ['Gobi Manchurian','Snacks',120,'Crispy cauliflower in Indo-Chinese sauce.'],
  ['Crispy Corn Pepper Salt','Snacks',130,'Crunchy corn tossed with pepper and herbs.'],
  ['Chilli Chicken','Snacks',180,'A popular spicy Indo-Chinese starter.'],
  ['Apollo Fish','Snacks',220,'Crispy fish tossed with curry leaves.'],
  ['Veg Spring Rolls','Snacks',110,'Crunchy rolls filled with seasoned vegetables.'],
  ['Peri Peri French Fries','Snacks',90,'Golden fries with peri-peri seasoning.'],
  ['Chicken Popcorn','Snacks',140,'Bite-sized crispy chicken pieces.'],
  ['Onion Pakoda','Snacks',70,'Crispy onion fritters.'],

  ['Gulab Jamun (2 pcs)','Desserts',60,'Warm dumplings in sugar syrup.'],
  ['Double Ka Meetha','Desserts',100,'Hyderabadi bread pudding with nuts.'],
  ['Qubani Ka Meetha','Desserts',120,'Apricot dessert served in royal style.'],
  ['Chocolate Brownie','Desserts',135,'Rich brownie with a soft centre.'],
  ['Rasmalai (2 pcs)','Desserts',90,'Soft cheese patties in saffron milk.'],
  ['Mango Kulfi','Desserts',75,'Creamy frozen mango dessert.'],
  ['Caramel Custard','Desserts',85,'Silky baked custard with caramel.'],
  ['Chocolate Lava Cake','Desserts',145,'Warm cake with molten chocolate centre.'],
  ['Fruit Salad with Ice Cream','Desserts',110,'Seasonal fruit with ice cream.'],
  ['Sweet Lassi','Desserts',65,'Chilled yoghurt drink.'],

  ['Butter Chicken with Naan','Dinner',260,'Creamy tomato chicken curry with naan.'],
  ['Paneer Butter Masala with Roti','Dinner',210,'Paneer in buttery tomato gravy.'],
  ['Kadai Chicken with Rice','Dinner',240,'Chicken cooked with peppers and kadai spices.'],
  ['Dal Tadka with Jeera Rice','Dinner',160,'Comforting yellow dal with cumin rice.'],
  ['Mutton Rogan Josh with Rice','Dinner',290,'Slow-cooked aromatic mutton curry.'],
  ['Veg Fried Rice','Dinner',140,'Wok-tossed rice with fresh vegetables.'],
  ['Chicken Hakka Noodles','Dinner',170,'Noodles tossed with chicken and vegetables.'],
  ['Tandoori Roti Basket','Dinner',70,'Freshly baked whole-wheat rotis.'],
  ['Fish Curry with Steamed Rice','Dinner',230,'Coastal fish curry with steamed rice.'],
  ['Veg Pulao with Raita','Dinner',150,'Vegetable rice with cooling raita.']
];

const NONVEG = /chicken|mutton|prawn|egg|fish|apollo/i;

const DEFAULT_MENU = raw.map((a, i) => ({
  id: i + 1,
  name: a[0],
  category: a[1],
  price: a[2],
  description: a[3],
  available: true,
  veg: !NONVEG.test(a[0]),
  image: photo(pics[a[1]][i % 10])
}));

const CATEGORIES = ['All', 'Biryani', 'Tiffins', 'Snacks', 'Desserts', 'Dinner'];

const STAGES = ['PLACED', 'PREPARING', 'READY FOR PICKUP', 'OUT FOR DELIVERY', 'DELIVERED'];

const STAGE_LABEL = {
  PLACED: 'Placed',
  PREPARING: 'Preparing',
  'READY FOR PICKUP': 'Ready',
  'OUT FOR DELIVERY': 'On the way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

const PLUS = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

/* =========================================================
   helpers + state
   ========================================================= */

const el = id => document.getElementById(id);

const money = n => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(n);

const safe = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

const load = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? structuredClone(d);
  } catch {
    return structuredClone(d);
  }
};

const put = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

let selectedRole = 'customer';
let currentUser = null;
let activeCategory = 'All';
let activePromo = '';
let lastCreatedOrderId = null;
let isSignUpMode = false;

let menu = load('ff_menu_v4', DEFAULT_MENU);
let orders = load('ff_orders_v4', []);
let cart = load('ff_cart_v5', []);
let nextOrder = Number(load('ff_next_v4', 1001));
let delivery = { fee: 30, threshold: 499, ...load('ff_delivery_v4', {}) };

menu.forEach(m => {
  if (typeof m.veg !== 'boolean') m.veg = !NONVEG.test(m.name);
});

cart = cart.filter(c => menu.some(m => m.id === c.foodId));

const save = () => {
  put('ff_menu_v4', JSON.stringify(menu));
  put('ff_orders_v4', JSON.stringify(orders));
  put('ff_next_v4', JSON.stringify(nextOrder));
  put('ff_delivery_v4', JSON.stringify(delivery));
};

const persistCart = () => put('ff_cart_v5', JSON.stringify(cart));
const cartQty = id => cart.find(c => c.foodId === id)?.quantity || 0;
const cartCount = () => cart.reduce((s, x) => s + x.quantity, 0);

function imgFallback(img) {
  if (img.dataset.fb) return;
  img.dataset.fb = '1';

  const t = ((img.alt || 'F').trim()[0] || 'F').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><radialGradient id="g" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#FFD76A"/><stop offset="1" stop-color="#E0861C"/></radialGradient></defs><rect width="200" height="200" fill="url(#g)"/><text x="100" y="132" font-size="100" font-weight="800" text-anchor="middle" fill="#12372A" fill-opacity=".85" font-family="Georgia,serif">${t}</text></svg>`;

  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* keep keyboard focus on the same control after a re-render */

function keepFocus(fn) {
  const k = document.activeElement?.dataset?.k;
  fn();

  if (!k) return;

  let n = document.querySelector(`[data-k="${k}"]`);

  if (!n && k.startsWith('a-')) {
    n = document.querySelector(`[data-k="p-${k.slice(2)}"]`);
  }

  if (n) n.focus({ preventScroll: true });
}

/* =========================================================
   theme
   ========================================================= */

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  put('ff_theme', next);
}

/* =========================================================
   Supabase authentication
   ========================================================= */

function showAuthError(message) {
  const error = el('login-error');
  if (!error) return;

  error.textContent = message;
  error.classList.add('error');
  error.classList.remove('notice', 'hidden');
}

function showAuthNotice(message) {
  const error = el('login-error');
  if (!error) return;

  error.textContent = message;
  error.classList.remove('error', 'hidden');
  error.classList.add('notice');
}

function clearAuthError() {
  const error = el('login-error');
  if (!error) return;

  error.textContent = '';
  error.classList.add('error', 'hidden');
  error.classList.remove('notice');
}

function togglePasswordVisibility(btn) {
  const password = el('login-password');
  if (!password) return;

  password.type = password.type === 'password' ? 'text' : 'password';

  if (btn) {
    btn.textContent = password.type === 'password' ? 'Show' : 'Hide';
  }
}

function toggleAuthMode() {
  isSignUpMode = !isSignUpMode;
  clearAuthError();

  const heading = el('auth-heading');
  const description = el('auth-description');
  const nameField = el('name-field');
  const submit = el('auth-submit');
  const switchText = el('auth-switch-text');
  const switchButton = el('auth-switch');

  if (heading) {
    heading.textContent = isSignUpMode ? 'Create your account' : 'Welcome back';
  }

  if (description) {
    description.textContent = isSignUpMode
      ? 'Create an account to start ordering your favourite food.'
      : 'Sign in to continue to FoodFusion.';
  }

  if (nameField) {
    nameField.classList.toggle('hidden', !isSignUpMode);
  }

  if (submit) {
    submit.textContent = isSignUpMode ? 'Create Account' : 'Sign In';
  }

  if (switchText) {
    switchText.textContent = isSignUpMode
      ? 'Already have an account?'
      : "Don't have an account?";
  }

  if (switchButton) {
    switchButton.textContent = isSignUpMode ? 'Sign In' : 'Create Account';
  }
}

async function getUserProfile(user) {
  const { data, error } = await foodFusionSupabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.warn('Could not load profile, continuing as customer:', error.message);
  }

  return (!error && data) || {
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    role: 'customer'
  };
}

async function enterApp(user, profile) {
  const role = profile?.role === 'admin' ? 'admin' : 'customer';

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'User';

  selectedRole = role;

  currentUser = {
    id: user.id,
    email: user.email,
    full_name: displayName,
    role
  };

  el('auth-view')?.classList.add('hidden');
  el('app-view')?.classList.remove('hidden');

  if (el('logged-user-name')) {
    el('logged-user-name').textContent = displayName;
  }

  if (el('logged-user-role')) {
    el('logged-user-role').textContent =
      role === 'admin' ? 'Restaurant admin' : 'Customer';
  }

  if (el('logged-avatar')) {
    el('logged-avatar').textContent = displayName.charAt(0).toUpperCase();
  }

  if (el('tab-btn-admin')) {
    el('tab-btn-admin').classList.toggle('hidden', role !== 'admin');
  }

  renderAll();
  switchTab(role === 'admin' ? 'admin-sec' : 'menu-sec');

  const hero = el('hero');

  if (hero) {
    hero.classList.remove('enter');
    void hero.offsetWidth;
    hero.classList.add('enter');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  clearAuthError();

  if (typeof foodFusionSupabase === 'undefined') {
    showAuthError('Supabase is not initialized. Check supabase-client.js and script loading order.');
    return;
  }

  const email = el('login-email')?.value.trim();
  const password = el('login-password')?.value;
  const fullName = el('login-name')?.value.trim();
  const submit = el('auth-submit');

  if (!email || !password) {
    showAuthError('Enter your email address and password.');
    return;
  }

  if (isSignUpMode && !fullName) {
    showAuthError('Enter your full name.');
    return;
  }

  if (password.length < 6) {
    showAuthError('Password must contain at least 6 characters.');
    return;
  }

  if (submit) {
    submit.disabled = true;
    submit.textContent = isSignUpMode ? 'Creating account…' : 'Signing in…';
  }

  try {
    if (isSignUpMode) {
      const { data, error } = await foodFusionSupabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) throw error;

      if (data.session && data.user) {
        const profile = await getUserProfile(data.user);
        await enterApp(data.user, profile);
      } else {
        showAuthNotice(
          'Account created. Check your email to confirm your account, then sign in.'
        );
      }
    } else {
      const { data, error } = await foodFusionSupabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      const profile = await getUserProfile(data.user);
      await enterApp(data.user, profile);
    }
  } catch (error) {
    showAuthError(error.message || 'Authentication failed. Please try again.');
  } finally {
    if (submit) {
      submit.disabled = false;
      submit.textContent = isSignUpMode ? 'Create Account' : 'Sign In';
    }
  }
}

async function handleLogout() {
  try {
    const { error } = await foodFusionSupabase.auth.signOut();

    if (error) throw error;
  } catch (error) {
    console.error('Sign out failed:', error.message);
    toast('Could not sign out. Please try again.');
    return;
  }

  currentUser = null;
  selectedRole = 'customer';

  /* the next person on this browser must not see this person's cart or tracked order */
  cart = [];
  activePromo = '';
  persistCart();
  if (el('track-input')) el('track-input').value = '';
  if (el('tracked-order-view')) {
    el('tracked-order-view').classList.add('hidden');
    el('tracked-order-view').innerHTML = '';
  }

  el('app-view')?.classList.add('hidden');
  el('auth-view')?.classList.remove('hidden');

  if (el('login-form')) {
    el('login-form').reset();
  }

  clearAuthError();
  window.scrollTo(0, 0);
}

/* =========================================================
   navigation + toast
   ========================================================= */

function switchTab(id) {
  if (id === 'admin-sec' && currentUser?.role !== 'admin') {
    id = 'menu-sec';
  }

  document.querySelectorAll('.tab-section').forEach(s => {
    s.classList.toggle('active', s.id === id);
  });

  document.querySelectorAll('.nav').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === id);
  });

  if (id === 'cart-sec') renderCart();
  if (id === 'track-sec') renderOrders();
  if (id === 'admin-sec') renderAdmin();

  floating();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function toast(s) {
  const n = document.createElement('div');
  n.className = 'toast';
  n.textContent = s;
  el('toast-container').append(n);
  setTimeout(() => n.remove(), 2600);
}

function renderAll() {
  renderHero();
  renderCats();
  renderMenu();
  renderCart();
  renderOrders();
  renderAdmin();
}

/* =========================================================
   hero
   ========================================================= */

function renderHero() {
  const pick = menu.find(x => x.id === 2) || menu[0];

  el('hero-count').textContent = menu.length;
  el('fact-dishes').textContent = menu.length;

  el('hero-free').textContent = delivery.threshold
    ? `Free delivery above ${money(delivery.threshold)}`
    : 'Delivered hot to your door';

  if (!pick) {
    el('hero-chip').innerHTML = '';
    return;
  }

  const img = el('hero-img');

  if (img.getAttribute('src') !== pick.image) {
    delete img.dataset.fb;
    img.src = pick.image;
  }

  img.alt = pick.name;

  el('hero-chip').innerHTML =
    `<div><small>Chef's pick</small><b>${safe(pick.name)}</b><span class="price">${money(pick.price)}</span></div>` +
    `${pick.available ? `<button class="add-btn" onclick="addToCart(${pick.id})">${PLUS} Add</button>` : ''}`;
}

/* =========================================================
   menu
   ========================================================= */

function renderCats() {
  el('category-pills').innerHTML = CATEGORIES.map(c => {
    const n = c === 'All' ? menu.length : menu.filter(x => x.category === c).length;

    return `<button class="cat ${activeCategory === c ? 'selected' : ''}" role="tab" aria-selected="${activeCategory === c}" onclick="setCategory('${c}')">${c === 'All' ? 'All dishes' : c}<span>${n}</span></button>`;
  }).join('');
}

function setCategory(c) {
  activeCategory = c;
  renderCats();
  renderMenu();
}

function actionHTML(x) {
  if (!x.available) return '<span class="muted-tag">Unavailable</span>';

  const q = cartQty(x.id);

  return q
    ? `<div class="stepper" role="group" aria-label="Quantity of ${safe(x.name)}"><button data-k="m-${x.id}" onclick="qty(${x.id},-1)" aria-label="Remove one">−</button><b>${q}</b><button data-k="p-${x.id}" onclick="qty(${x.id},1)" aria-label="Add one">+</button></div>`
    : `<button class="add-btn" data-k="a-${x.id}" onclick="addToCart(${x.id})" aria-label="Add ${safe(x.name)} to cart">${PLUS} Add</button>`;
}

function dishCard(x) {
  return `<article class="dish ${x.available ? '' : 'is-out'}">
    <span class="vm ${x.veg ? '' : 'nonveg'}" role="img" aria-label="${x.veg ? 'Vegetarian' : 'Non-vegetarian'}"></span>
    ${x.available ? '' : '<span class="out-tag">Sold out</span>'}
    <div class="dish-img"><img loading="lazy" src="${safe(x.image)}" alt="${safe(x.name)}" onerror="imgFallback(this)"></div>
    <h3>${safe(x.name)}</h3>
    <p>${safe(x.description)}</p>
    <div class="dish-foot"><b class="price">${money(x.price)}</b><div data-act="${x.id}">${actionHTML(x)}</div></div>
  </article>`;
}

function renderMenu() {
  const q = el('search-input').value.trim().toLowerCase();
  const only = el('avail-filter').checked;
  const veg = el('veg-filter').checked;
  const s = el('sort-select').value;

  const list = menu.filter(x =>
    (activeCategory === 'All' || x.category === activeCategory) &&
    (!only || x.available) &&
    (!veg || x.veg) &&
    `${x.name} ${x.category} ${x.description}`.toLowerCase().includes(q)
  );

  if (s === 'low') list.sort((a, b) => a.price - b.price);
  if (s === 'high') list.sort((a, b) => b.price - a.price);
  if (s === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

  el('menu-count').textContent = `Showing ${list.length} of ${menu.length} dishes`;

  el('menu-grid').innerHTML = list.length
    ? list.map(dishCard).join('')
    : '<div class="empty"><h3>No dishes match</h3><p>Try a different search, or clear the filters.</p><button class="btn outline" onclick="clearFilters()">Clear filters</button></div>';
}

function clearFilters() {
  el('search-input').value = '';
  el('avail-filter').checked = false;
  el('veg-filter').checked = false;
  el('sort-select').value = 'default';
  activeCategory = 'All';
  renderCats();
  renderMenu();
}

function refreshActions() {
  document.querySelectorAll('[data-act]').forEach(n => {
    const x = menu.find(m => m.id === Number(n.dataset.act));
    if (x) n.innerHTML = actionHTML(x);
  });
}

/* =========================================================
   cart
   ========================================================= */

function cartChanged() {
  persistCart();
  keepFocus(() => {
    refreshActions();
    renderCart();
  });
  floating();
}

function addToCart(id) {
  const f = menu.find(x => x.id === id);
  if (!f || !f.available) return;

  const c = cart.find(x => x.foodId === id);

  if (c) c.quantity++;
  else cart.push({
    foodId: id,
    name: f.name,
    category: f.category,
    price: f.price,
    image: f.image,
    quantity: 1
  });

  cartChanged();
}

function qty(id, d) {
  const x = cart.find(c => c.foodId === id);
  if (!x) return;

  x.quantity += d;

  if (x.quantity < 1) {
    cart = cart.filter(c => c.foodId !== id);
  }

  cartChanged();
}

function removeItem(id) {
  cart = cart.filter(x => x.foodId !== id);
  cartChanged();
  toast('Removed from your cart');
}

function clearCart() {
  if (!cart.length) return;

  cart = [];
  activePromo = '';
  cartChanged();
  toast('Cart cleared');
}

function totals() {
  const sub = cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const fee = cart.length
    ? (delivery.threshold && sub >= delivery.threshold ? 0 : delivery.fee)
    : 0;

  const discount =
    activePromo === 'FUSION10' ? Math.round(sub * .1) :
    activePromo === 'FREE30' ? fee : 0;

  return {
    sub,
    fee,
    discount,
    total: sub + fee - discount
  };
}

function renderCart() {
  el('nav-cart-badge').textContent = cartCount();
  el('nav-cart-badge').classList.toggle('on', cartCount() > 0);

  el('cart-items-container').innerHTML = cart.length
    ? cart.map(x => `<div class="cart-row">
        <img src="${safe(x.image)}" alt="" onerror="imgFallback(this)">
        <div class="cart-name"><b>${safe(x.name)}</b><small>${money(x.price)} each</small>
          <div class="stepper" role="group" aria-label="Quantity of ${safe(x.name)}"><button data-k="cm-${x.foodId}" onclick="qty(${x.foodId},-1)" aria-label="Remove one">−</button><b>${x.quantity}</b><button data-k="cp-${x.foodId}" onclick="qty(${x.foodId},1)" aria-label="Add one">+</button></div>
        </div>
        <div class="cart-end"><b>${money(x.price * x.quantity)}</b><button class="link danger" onclick="removeItem(${x.foodId})">Remove</button></div>
      </div>`).join('')
    : `<div class="empty"><h3>Your cart is empty</h3><p>Add a dish from the menu and it will show up here.</p><button class="btn outline" onclick="switchTab('menu-sec')">Browse the menu</button></div>`;

  const t = totals();

  el('bill-subtotal').textContent = money(t.sub);
  el('bill-delivery').textContent = t.fee ? money(t.fee) : (cart.length ? 'Free' : money(0));
  el('bill-discount').textContent = '-' + money(t.discount);
  el('bill-grandtotal').textContent = money(t.total);
  el('discount-row').classList.toggle('hidden', !t.discount);
  el('checkout-form').querySelector('button[type=submit]').disabled = !cart.length;

  const fp = el('free-progress');

  if (cart.length && delivery.threshold) {
    const left = delivery.threshold - t.sub;
    const pct = Math.min(100, Math.round(t.sub / delivery.threshold * 100));

    fp.innerHTML = `<span>${left > 0 ? `Add <b>${money(left)}</b> more for free delivery` : 'You have free delivery'}</span><div class="meter"><i style="--p:${pct}%"></i></div>`;
  } else {
    fp.innerHTML = '';
  }
}

function applyPromoCode() {
  const c = el('promo-input').value.trim().toUpperCase();

  activePromo = ['FUSION10', 'FREE30'].includes(c) ? c : '';

  toast(activePromo ? `${c} applied` : 'That promo code is not valid');
  renderCart();
}

function floating() {
  const n = cartCount();
  const show = n && el('menu-sec').classList.contains('active');

  el('floating-cart-bar').classList.toggle('hidden', !show);
  el('float-items-count').textContent = `${n} item${n === 1 ? '' : 's'}`;
  el('float-subtotal').textContent = money(totals().sub);
}

/* =========================================================
   checkout + orders
   ========================================================= */

/* a customer only sees their own orders; the restaurant admin sees all of them */
const canSeeOrder = o => currentUser?.role === 'admin' || (!!currentUser && o.userId === currentUser.id);
const myOrders = () => orders.filter(canSeeOrder);

function handlePlaceOrder(e) {
  e.preventDefault();

  if (!cart.length) return;

  const phone = el('cust-phone').value.trim();

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return toast('Enter a valid 10-digit mobile number');
  }

  const t = totals();

  const o = {
    id: 'ORD-' + nextOrder++,
    userId: currentUser?.id || null,
    customer: el('cust-name').value.trim(),
    phone,
    address: el('cust-address').value.trim(),
    payment: el('payment-mode').value,
    items: cart.map(x => ({ ...x })),
    total: t.total,
    status: 'PLACED',
    created: new Date().toLocaleString('en-IN')
  };

  orders.unshift(o);
  lastCreatedOrderId = o.id;

  cart = [];
  activePromo = '';

  el('checkout-form').reset();

  save();
  persistCart();
  renderAll();
  floating();

  el('receipt-body').innerHTML =
    `<p><b>Order ID</b><span>${o.id}</span></p>` +
    o.items.map(i => `<p><span>${safe(i.name)} × ${i.quantity}</span><span>${money(i.price * i.quantity)}</span></p>`).join('') +
    `<p><b>Total</b><b>${money(o.total)}</b></p><p><span>Payment</span><span>${safe(o.payment)}</span></p>`;

  el('receipt-modal').classList.remove('hidden');
  el('receipt-modal').querySelector('.btn').focus();
}

function closeReceiptModal() {
  el('receipt-modal').classList.add('hidden');
}

function closeReceiptAndTrack() {
  closeReceiptModal();
  switchTab('track-sec');
  el('track-input').value = lastCreatedOrderId;
  searchOrder();
}

function stepsHTML(status) {
  if (status === 'CANCELLED') return '';

  const i = STAGES.indexOf(status);

  return `<div class="steps" style="--p:${i / (STAGES.length - 1)}">${STAGES.map((s, n) =>
    `<div class="step ${n <= i ? 'done' : ''} ${n === i ? 'now' : ''}"><i>${n < i ? '✓' : n + 1}</i>${STAGE_LABEL[s]}</div>`
  ).join('')}</div>`;
}

const statusPill = s =>
  `<span class="status ${s === 'DELIVERED' ? 's-delivered' : s === 'CANCELLED' ? 's-cancelled' : ''}">${STAGE_LABEL[s] || safe(s)}</span>`;

function searchOrder() {
  const id = el('track-input').value.trim().toUpperCase();
  const o = orders.find(x => x.id === id && canSeeOrder(x));
  const box = el('tracked-order-view');

  box.classList.remove('hidden');

  if (!o) {
    box.innerHTML = '<p class="error">No order found with that ID. Check it and try again.</p>';
    return;
  }

  box.innerHTML = `
    <div class="order-head"><h3>${o.id}</h3>${statusPill(o.status)}</div>
    ${stepsHTML(o.status)}
    <div class="order-meta">
      <p><b>Items:</b> ${o.items.map(x => `${safe(x.name)} × ${x.quantity}`).join(', ')}</p>
      <p><b>Delivering to:</b> ${safe(o.address)}</p>
      <p><b>Total:</b> ${money(o.total)} · ${safe(o.payment)}</p>
    </div>
    ${o.status === 'PLACED' ? `<p><button class="link danger" onclick="cancelOrder('${o.id}')">Cancel this order</button></p>` : ''}`;
}

function cancelOrder(id) {
  const o = orders.find(x => x.id === id && canSeeOrder(x));

  if (o && o.status === 'PLACED') {
    o.status = 'CANCELLED';
    save();
    searchOrder();
    renderOrders();
    renderAdmin();
    toast('Order cancelled');
  }
}

function renderOrders() {
  const list = myOrders();

  el('total-orders-count').textContent =
    `${list.length} order${list.length === 1 ? '' : 's'}`;

  el('all-orders-list').innerHTML = list.length
    ? list.map(o => `<div class="history">
        <div><b>${o.id}</b><small>${safe(o.created)} · ${o.items.reduce((s, x) => s + x.quantity, 0)} items</small></div>
        <b>${money(o.total)}</b>${statusPill(o.status)}
        <button class="link" onclick="el('track-input').value='${o.id}';searchOrder();window.scrollTo({top:0,behavior:'smooth'})">Track</button>
      </div>`).join('')
    : '<div class="empty"><h3>No orders yet</h3><p>Orders you place will show up here.</p><button class="btn outline" onclick="switchTab(\'menu-sec\')">Browse the menu</button></div>';
}

/* =========================================================
   admin
   ========================================================= */

function handleAddFood(e) {
  e.preventDefault();

  const name = el('new-food-name').value.trim();
  const cat = el('new-food-category').value;
  const price = Number(el('new-food-price').value);

  if (!name || price <= 0) return;

  menu.push({
    id: Math.max(0, ...menu.map(x => x.id)) + 1,
    name,
    category: cat,
    price,
    description: 'Freshly prepared in our kitchen.',
    veg: el('new-food-veg').checked,
    image: el('new-food-image').value.trim() || photo(pics[cat][0]),
    available: el('new-food-avail').checked
  });

  save();
  e.target.reset();
  renderAll();
  toast(`${name} added to the menu`);
}

function toggleAvail(id) {
  const x = menu.find(x => x.id === id);
  x.available = !x.available;
  save();
  renderAll();
}

function priceUpdate(id, v) {
  const x = menu.find(x => x.id === id);
  const n = Number(v);

  if (x && n > 0) {
    x.price = n;
    cart.forEach(c => {
      if (c.foodId === id) c.price = n;
    });

    persistCart();
    save();
    renderAll();
    toast('Price updated');
  }
}

function deleteFood(id) {
  if (!confirm('Delete this menu item?')) return;

  menu = menu.filter(x => x.id !== id);
  cart = cart.filter(x => x.foodId !== id);

  persistCart();
  save();
  renderAll();
}

function updateOrderStatus(id, s) {
  const o = orders.find(x => x.id === id);

  if (o) {
    o.status = s;
    save();
    renderOrders();
    renderAdmin();
  }
}

function renderAdmin() {
  const q = el('admin-search').value.toLowerCase();

  el('admin-menu-tbody').innerHTML = menu
    .filter(x => x.name.toLowerCase().includes(q))
    .map(x => `<tr><td>${safe(x.name)}</td>
      <td><input class="price-edit" type="number" min="1" value="${x.price}" aria-label="Price of ${safe(x.name)}" onchange="priceUpdate(${x.id},this.value)"></td>
      <td><button class="avail-btn ${x.available ? '' : 'off'}" onclick="toggleAvail(${x.id})">${x.available ? 'Available' : 'Sold out'}</button></td>
      <td><button class="link danger" onclick="deleteFood(${x.id})">Delete</button></td></tr>`
    ).join('');

  el('admin-orders-tbody').innerHTML = orders.map(o =>
    `<tr><td><b>${o.id}</b></td><td>${safe(o.customer)}</td>
      <td>${o.items.map(x => safe(x.name) + ' × ' + x.quantity).join('<br>')}</td><td>${money(o.total)}</td>
      <td><select aria-label="Status of ${o.id}" onchange="updateOrderStatus('${o.id}',this.value)">${[...STAGES, 'CANCELLED'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${STAGE_LABEL[s]}</option>`).join('')}</select></td></tr>`
  ).join('') || '<tr><td colspan="5">No orders yet. New orders appear here.</td></tr>';

  const live = orders.filter(x => x.status !== 'CANCELLED');

  el('stat-total-items').textContent = menu.length;
  el('stat-avail-items').textContent = menu.filter(x => x.available).length;
  el('stat-total-orders').textContent = orders.length;
  el('stat-total-rev').textContent =
    money(live.reduce((s, x) => s + x.total, 0));

  el('admin-delivery-fee').value = delivery.fee;
  el('admin-free-threshold').value = delivery.threshold;

  const byCat = {};

  live.forEach(o => o.items.forEach(i => {
    const c = i.category || menu.find(m => m.id === i.foodId)?.category || 'Other';
    byCat[c] = (byCat[c] || 0) + i.price * i.quantity;
  }));

  const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const max = rows[0]?.[1] || 1;

  el('rev-chart').innerHTML = rows.length
    ? rows.map(([c, v]) => `<div class="bar-row"><span>${safe(c)}</span><div class="bar"><i style="--w:${Math.round(v / max * 100)}%"></i></div><b>${money(v)}</b></div>`).join('')
    : '<p class="muted">Revenue by category will appear after the first order.</p>';
}

function saveDeliverySettings() {
  delivery = {
    fee: Math.max(0, Number(el('admin-delivery-fee').value) || 0),
    threshold: Math.max(0, Number(el('admin-free-threshold').value) || 0)
  };

  save();
  renderCart();
  renderHero();
  floating();
  toast('Delivery settings saved');
}

function resetDefaultData() {
  if (!confirm('Reset all FoodFusion demo data?')) return;

  menu = structuredClone(DEFAULT_MENU);
  orders = [];
  cart = [];
  nextOrder = 1001;
  delivery = { fee: 30, threshold: 499 };
  activePromo = '';

  save();
  persistCart();
  renderAll();
  floating();
  toast('Demo data reset');
}

/* =========================================================
   keyboard + boot
   ========================================================= */

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeReceiptModal();

  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(
    document.activeElement?.tagName || ''
  );

  if (
    e.key === '/' &&
    !typing &&
    currentUser &&
    el('menu-sec')?.classList.contains('active')
  ) {
    e.preventDefault();
    el('search-input').focus();
  }
});

el('receipt-modal')?.addEventListener('click', e => {
  if (e.target.id === 'receipt-modal') {
    closeReceiptModal();
  }
});

async function boot() {
  if (typeof foodFusionSupabase === 'undefined') {
    console.error('Supabase client is not initialized. Check script loading order.');
    showAuthError('Unable to connect to the authentication service. Please refresh the page.');
    return;
  }

  try {
    const { data, error } = await foodFusionSupabase.auth.getSession();

    if (error) throw error;

    if (data.session?.user) {
      const profile = await getUserProfile(data.session.user);
      await enterApp(data.session.user, profile);
    } else {
      el('auth-view')?.classList.remove('hidden');
      el('app-view')?.classList.add('hidden');
    }
  } catch (error) {
    console.error('FoodFusion startup failed:', error);
    showAuthError(error.message || 'Could not load your account. Please refresh the page.');
  }
}

boot();

