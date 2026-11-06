import { useShop } from '../context/ShopContext';
import { STAGES, STAGE_LABEL } from '../data/menu';
import { money } from '../lib/utils';
import StatusPill from '../components/StatusPill';
import EtaBox from '../components/EtaBox';

function Steps({ status }) {
  if (status === 'CANCELLED') return null;
  const i = STAGES.indexOf(status);
  return (
    <div className="steps" style={{ '--p': i / (STAGES.length - 1) }}>
      {STAGES.map((s, n) => (
        <div key={s} className={'step ' + (n <= i ? 'done ' : '') + (n === i ? 'now' : '')}>
          <i>{n < i ? '✓' : n + 1}</i>{STAGE_LABEL[s]}
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage({ goTab, input, setInput, query, setQuery }) {
  const { myOrders, cancelOrder } = useShop();

  // The tracked order is looked up from the live list every render, so when the
  // status changes (timer or admin) this view updates itself. No manual re-search needed.
  const tracked = query ? myOrders.find(o => o.id === query) : null;

  function search(id = input) {
    setQuery(id.trim().toUpperCase());
  }

  return (
    <section className="tab-section page active">
      <div className="wrap">
        <div className="page-head"><h1>My orders</h1><p>Follow an order from the kitchen to your door.</p></div>

        <div className="panel">
          <h2>Track an order</h2>
          <div className="track-search">
            <input placeholder="Order ID, for example ORD-1001" aria-label="Order ID" value={input}
                   onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
            <button className="btn primary" onClick={() => search()}>Track order</button>
          </div>

          {query && (
            <div id="tracked-order-view" aria-live="polite">
              {!tracked ? (
                <p className="error">No order found with that ID. Check it and try again.</p>
              ) : (
                <>
                  <div className="order-head"><h3>{tracked.id}</h3><StatusPill status={tracked.status} /></div>
                  <Steps status={tracked.status} />
                  {STAGES.includes(tracked.status) && <EtaBox order={tracked} />}
                  <div className="order-meta">
                    <p><b>Items:</b> {tracked.items.map(x => `${x.name} × ${x.quantity}`).join(', ')}</p>
                    <p><b>Delivering to:</b> {tracked.address}</p>
                    <p><b>Total:</b> {money(tracked.total)} · {tracked.payment}</p>
                  </div>
                  {tracked.status === 'PLACED' && (
                    <p><button className="link danger" onClick={() => cancelOrder(tracked.id)}>Cancel this order</button></p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Order history</h2>
            <span className="muted">{myOrders.length} order{myOrders.length === 1 ? '' : 's'}</span>
          </div>
          <div>
            {myOrders.length ? (
              myOrders.map(o => (
                <div className="history" key={o.id}>
                  <div>
                    <b>{o.id}</b>
                    <small>{o.created} · {o.items.reduce((s, x) => s + x.quantity, 0)} items</small>
                  </div>
                  <b>{money(o.total)}</b>
                  <StatusPill status={o.status} />
                  <button className="link" onClick={() => { setInput(o.id); search(o.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Track
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">
                <h3>No orders yet</h3>
                <p>Orders you place will show up here.</p>
                <button className="btn outline" onClick={() => goTab('menu')}>Browse the menu</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
