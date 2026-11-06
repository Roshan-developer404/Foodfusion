import { useState } from 'react';
import { imgFallback } from '../lib/utils';

/* BEFORE: 6 helper functions (showAuthError, clearAuthError, toggleAuthMode ...) that found
           elements by id and changed their text / classes.
   NOW:    a few useState variables. The text on screen is just a result of those variables. */
export default function LoginPage({ auth }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(auth.bootError ? { type: 'error', text: auth.bootError } : null);
  const [busy, setBusy] = useState(false);

  function switchMode() {
    setIsSignUp(v => !v);
    setMessage(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanEmail || !password) return setMessage({ type: 'error', text: 'Enter your email address and password.' });
    if (isSignUp && !cleanName) return setMessage({ type: 'error', text: 'Enter your full name.' });
    if (password.length < 6) return setMessage({ type: 'error', text: 'Password must contain at least 6 characters.' });

    setBusy(true);
    try {
      if (isSignUp) {
        const { notice } = await auth.signUp(cleanEmail, password, cleanName);
        if (notice) setMessage({ type: 'notice', text: notice });
      } else {
        await auth.signIn(cleanEmail, password);
      }
      // on success `auth.user` is set and <App> switches to the shop by itself
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Authentication failed. Please try again.' });
      setBusy(false);
    }
  }

  return (
    <div id="auth-view" className="auth">
      <section className="auth-art">
        <span className="glyph" aria-hidden="true">రుచి</span>
        <a className="brand" href="#" onClick={e => e.preventDefault()}>
          <b className="mark">F</b><span>FoodFusion</span>
        </a>
        <div className="auth-copy">
          <h1>Sign in and pick your plate.</h1>
          <p>Biryani, tiffins, snacks, desserts and dinner. Cooked when you order.</p>
        </div>
        <div className="auth-plate" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=80" alt="" onError={imgFallback} />
        </div>
      </section>

      <section className="auth-side">
        <div className="login-card">
          <h2>{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
          <p className="muted">
            {isSignUp ? 'Create an account to start ordering your favourite food.' : 'Sign in to continue to FoodFusion.'}
          </p>

          <form id="login-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <label>
                Full name
                <input type="text" placeholder="Enter your full name" autoComplete="name"
                       value={name} onChange={e => setName(e.target.value)} />
              </label>
            )}

            <label>
              Email address
              <input type="email" required placeholder="Enter your email" autoComplete="email"
                     value={email} onChange={e => setEmail(e.target.value)} />
            </label>

            <label>
              Password
              <span className="password">
                <input type={showPassword ? 'text' : 'password'} required minLength={6}
                       placeholder="Enter your password" autoComplete={isSignUp ? 'new-password' : 'current-password'}
                       value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(v => !v)} aria-label="Show or hide password">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
            </label>

            {message && <p className={message.type} role="alert">{message.text}</p>}

            <button className="btn primary wide" type="submit" disabled={busy}>
              {busy ? (isSignUp ? 'Creating account…' : 'Signing in…') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <p className="muted" style={{ textAlign: 'center', marginTop: 18 }}>
            <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>{' '}
            <button type="button" className="link" onClick={switchMode}>
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
