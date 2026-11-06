import { useEffect, useRef, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { QUICK, greeting, reply } from '../lib/botBrain.jsx';

/* The chat window. BEFORE: bot.js built the panel with document.createElement and
   watched #app-view with a MutationObserver to know when to hide.
   NOW:    it is just a component that only exists while you are signed in. */
export default function FusionBot({ goTab, openTracker }) {
  const shop = useShop();
  const shopRef = useRef(shop);
  shopRef.current = shop; // the delayed reply below always uses the latest shop data

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // [{ id, who: 'bot' | 'user', content }]
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const nextId = useRef(1);

  const push = (who, content) => setMessages(m => [...m, { id: nextId.current++, who, content }]);

  function toggle(v) {
    setOpen(v);
    if (v && messages.length === 0) push('bot', greeting(shop.user));
  }

  function ask(question) {
    push('user', question);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      try {
        const out = reply(question, { ...shopRef.current, goTab, openTracker, closeBot: () => setOpen(false) });
        if (out) push('bot', out);
      } catch (err) {
        console.error(err);
        push('bot', 'Sorry, something went wrong. Please try again.');
      }
    }, 350);
  }

  function submit(e) {
    e.preventDefault();
    const t = text.trim();
    if (t) { setText(''); ask(t); }
  }

  // focus the box when opened, and keep the newest message in view
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { logRef.current && (logRef.current.scrollTop = logRef.current.scrollHeight); }, [messages, typing]);

  return (
    <div id="ffbot-root">
      <button className="ffbot-fab" aria-label="Open FoodFusion assistant" title="Ask FoodFusion Bot" onClick={() => toggle(!open)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 8V5" /><circle cx="12" cy="4" r="1" /><circle cx="9" cy="13" r="1" fill="currentColor" /><circle cx="15" cy="13" r="1" fill="currentColor" /><path d="M9.5 16.5h5" /></svg>
      </button>

      <section className={'ffbot-panel' + (open ? ' open' : '')} role="dialog" aria-label="FoodFusion assistant">
        <div className="ffbot-head">
          <div><b>FusionBot</b><small>Your food assistant</small></div>
          <button className="x" aria-label="Close" onClick={() => toggle(false)}>×</button>
        </div>

        <div className="ffbot-log" aria-live="polite" ref={logRef}>
          {messages.map(m => <div key={m.id} className={'ffbot-msg ' + m.who}>{m.content}</div>)}
          {typing && <div className="ffbot-msg bot"><span className="ffbot-typing"><i></i><i></i><i></i></span></div>}
        </div>

        <div className="ffbot-chips">
          {QUICK.map(q => <button key={q} type="button" onClick={() => ask(q)}>{q}</button>)}
        </div>

        <form className="ffbot-form" onSubmit={submit}>
          <input ref={inputRef} placeholder="Try: add 2 chicken biryani" aria-label="Message" autoComplete="off"
                 value={text} onChange={e => setText(e.target.value)} />
          <button>Send</button>
        </form>
      </section>
    </div>
  );
}
