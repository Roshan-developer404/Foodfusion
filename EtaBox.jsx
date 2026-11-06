import { useEffect, useState } from 'react';
import { STAGES } from '../data/menu';
import { STAGE_SECONDS } from '../context/ShopContext';

const MSG = {
  'PLACED': 'The kitchen has received your order',
  'PREPARING': 'Our chef is cooking your food',
  'READY FOR PICKUP': 'Packed and waiting for the rider',
  'OUT FOR DELIVERY': 'Your rider is on the way',
  'DELIVERED': 'Delivered. Enjoy your meal!'
};

const mmss = s => `${Math.floor(s / 60)}:${String(Math.max(0, Math.ceil(s % 60))).padStart(2, '0')}`;

// progress 0..1 and seconds left for an order
function calc(o, now) {
  if (o.status === 'DELIVERED') return { p: 1, left: 0 };
  const i = STAGES.indexOf(o.status);
  const elapsed = Math.min(STAGE_SECONDS[o.status], (now - (o.sAt || now)) / 1000);
  let left = STAGE_SECONDS[o.status] - elapsed;
  for (let k = i + 1; k < STAGES.length - 1; k++) left += STAGE_SECONDS[STAGES[k]];
  const total = Object.values(STAGE_SECONDS).reduce((a, b) => a + b, 0);
  return { p: Math.min(1, 1 - left / total), left };
}

/* The live countdown + moving scooter.
   BEFORE: setInterval(…) in track.js reaching into the DOM every second.
   NOW:    this component keeps its own `now` clock and re-draws itself. */
export default function EtaBox({ order }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t); // stop the clock when the box disappears
  }, []);

  const done = order.status === 'DELIVERED';
  const c = calc(order, now);

  return (
    <div className={'eta-box ' + (done ? 'done' : '')} style={{ '--r': c.p }}>
      <div className="eta-top">
        <span className="eta-msg">{MSG[order.status]}</span>
        <span className="eta-time">
          {done ? 'Arrived' : <>{mmss(c.left)}<small>until arrival</small></>}
        </span>
      </div>
      <div className="road">
        <span className="rest" aria-hidden="true">🍳</span>
        <span className="home" aria-hidden="true">🏠</span>
        <span className="rider" aria-hidden="true">🛵</span>
      </div>
      <p className="eta-note">Demo speed: a real delivery would take about 30 minutes.</p>
    </div>
  );
}
