# What changed when FoodFusion moved to React

## 1. The big idea

| | Before (vanilla JS) | After (React) |
|---|---|---|
| How you update the screen | Find an element, change it: `el('cart-count').textContent = n` | Change **state**; React redraws the screen for you |
| HTML | One big `index.html` + HTML strings inside JS (`` `<div>${x}</div>` ``) | Small **components** that return JSX |
| Remembering to refresh | You must call `renderCart()`, `renderMenu()`, `renderAdmin()` after every change | Not needed. Screen = function of state |
| Data | Global `let menu`, `let cart`, `let orders` | `useState` inside a store (`ShopContext`) |
| Libraries | `<script src="cdn...">` tags, load order matters | `npm install` + `import` |
| Running | Open `index.html` | `npm run dev` / `npm run build` |

The mental model: **UI = f(state)**. You never say "hide this, show that". You change a variable, and the
JSX describes what the screen looks like for that value.

## 2. File map: where did each old file go?

| Old file | New place | What happened |
|---|---|---|
| `index.html` (326 lines) | `index.html` (20 lines) + `src/pages/*.jsx` + `src/components/*.jsx` | The page content moved into components. `index.html` only has an empty `<div id="root">`. |
| `script.js` (1084 lines) | `src/data/menu.js`, `src/lib/utils.js`, `src/context/ShopContext.jsx`, `src/hooks/useAuth.js`, `src/pages/*` | Split by job. |
| `supabase-client.js` | `src/lib/supabase.js` | `import { createClient }` instead of a CDN global. |
| `compare.js` | `src/lib/compare.js` + `components/CompareSheet.jsx` + `SavingsBanner.jsx` | No more patching `window.addToCart`. |
| `track.js` | `ShopContext.jsx` (the timer) + `components/EtaBox.jsx` (countdown) | `setInterval` now lives in `useEffect`. |
| `bot.js` | `src/lib/botBrain.jsx` + `components/FusionBot.jsx` | Same brain, returns JSX instead of HTML strings. |
| `*.css` | `src/styles/*.css` | **Unchanged.** Imported in `main.jsx`. |

```
src/
  main.jsx            starts React, imports the CSS
  App.jsx             login page OR the shop (a simple if)
  data/menu.js        the 50 dishes, categories, order stages
  lib/                pure helpers: money(), calcTotals(), quote(), bot brain, supabase client
  hooks/              useAuth (login/logout), useSyncedState
  context/ShopContext menu + cart + orders + delivery + toasts + all actions
  pages/              Login, Menu, Cart, Orders, Admin
  components/         Header, DishCard, EtaBox, FusionBot, CompareSheet, ...
```

## 3. Five before/after examples to study

### A. Showing / hiding the login page
```js
// BEFORE  script.js
el('auth-view').classList.add('hidden');
el('app-view').classList.remove('hidden');
```
```jsx
// AFTER   App.jsx
if (!auth.user) return <LoginPage auth={auth} />;
return <Shop />;
```

### B. Re-rendering after a change
```js
// BEFORE: change data, then redraw every affected area by hand
function addToCart(id) { cart.push(...); persistCart(); refreshActions(); renderCart(); floating(); }
```
```jsx
// AFTER: change data. Everything that shows `cart` updates itself
setCart(prev => [...prev, newItem]);
```
The header badge, floating bar, menu steppers, cart page, bill and savings banner all read `cart`,
so they all update. That is the whole point of React.

### C. HTML strings -> JSX
```js
// BEFORE: template string, must escape user text with safe()
`<article class="dish">
   <h3>${safe(x.name)}</h3>
   <button onclick="addToCart(${x.id})">Add</button>
 </article>`
```
```jsx
// AFTER: JSX. `class` -> `className`, `onclick` -> `onClick`, React escapes text for you
<article className="dish">
  <h3>{food.name}</h3>
  <button onClick={() => addToCart(food.id)}>Add</button>
</article>
```

### D. Reading form inputs
```js
// BEFORE: read from the DOM when needed
const q = el('search-input').value.trim().toLowerCase();
```
```jsx
// AFTER: the input is "controlled" by state
const [search, setSearch] = useState('');
<input value={search} onChange={e => setSearch(e.target.value)} />
```

### E. Extending behaviour (compare.js)
```js
// BEFORE: replace the global function with a wrapped copy ("monkey patching")
const origAdd = window.addToCart;
window.addToCart = function (id) { origAdd(id); openCompare(id); };
```
```jsx
// AFTER: addToCart records "which dish was just added" in state; <CompareSheet /> reacts to it
setCompare(c => ({ id, n: c.n + 1, open: true }));
```

## 4. React ideas used (learn in this order)
1. **Components + JSX**: `DishCard.jsx`
2. **Props**: `<DishCard food={x} />`, `<Header tab={tab} goTab={goTab} />`
3. **useState**: `MenuPage.jsx` (search, sort, filters)
4. **Lists and `key`**: `list.map(x => <DishCard key={x.id} .../>)`
5. **Conditional rendering**: `{tab === 'cart' && <CartPage />}`
6. **Derived data**: the filtered menu, cart totals, revenue chart are *calculated*, never stored
7. **useEffect**: timers and key listeners (`EtaBox.jsx`, `ReceiptModal.jsx`, ShopContext ticker)
8. **Context**: `useShop()` gives any component the store without passing props through every level
9. **Custom hooks**: `useAuth`, `useSyncedState`

## 5. Behaviour notes (small, deliberate differences)
- Same `localStorage` keys, so menu, orders and cart from the old version carry over.
- Filters and the hero stay alive when you switch tabs (the Menu page is hidden, not destroyed).
- The tracked-order view and admin tables update on their own when a status changes; no manual refresh calls.
- The chatbot's "track my last order" now only looks at orders *you* can see (the old one used the full list).
- The price-comparison sheet shows the live quantity while open, not a snapshot.
- The Supabase library no longer comes from a CDN, so an ad blocker can't break login.

## 6. Good next steps
Add `react-router-dom` so each tab gets a real URL, then move orders and the menu from `localStorage`
into Supabase tables (that is what makes it a true full-stack app), then add tests with Vitest.
