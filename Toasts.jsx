import { useShop } from '../context/ShopContext';

// BEFORE: document.createElement('div') + setTimeout(remove)
// NOW:    just render whatever is in the `toasts` array
export default function Toasts() {
  const { toasts } = useShop();
  return (
    <div id="toast-container" role="status" aria-live="polite">
      {toasts.map(t => <div key={t.id} className="toast">{t.text}</div>)}
    </div>
  );
}
