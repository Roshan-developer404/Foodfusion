import { useEffect, useRef } from 'react';
import { money } from '../lib/utils';

export default function ReceiptModal({ order, onClose, onTrack }) {
  const trackBtn = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose; // always the latest function, without re-running the effect

  // Escape closes the popup; focus the main button when it opens
  useEffect(() => {
    if (!order) return;
    trackBtn.current?.focus();
    const onKey = e => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [order]);

  if (!order) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="receipt">
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        <svg className="tick" viewBox="0 0 52 52" width="64" height="64" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M15 27l8 8 14-16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <h2 id="receipt-title">Order placed</h2>
        <p className="muted">The kitchen has your order.</p>
        <div id="receipt-body">
          <p><b>Order ID</b><span>{order.id}</span></p>
          {order.items.map(i => (
            <p key={i.foodId}><span>{i.name} × {i.quantity}</span><span>{money(i.price * i.quantity)}</span></p>
          ))}
          <p><b>Total</b><b>{money(order.total)}</b></p>
          <p><span>Payment</span><span>{order.payment}</span></p>
        </div>
        <button ref={trackBtn} className="btn primary wide" onClick={() => onTrack(order.id)}>Track my order</button>
      </div>
    </div>
  );
}
