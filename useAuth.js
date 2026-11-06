import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/* Everything about "who is logged in" lives in this one hook.
   BEFORE: handleLogin / enterApp / handleLogout / boot in script.js poking at the DOM.
   NOW:    the hook only manages DATA (`user`); React decides what to show. */

async function getProfile(authUser) {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) console.warn('Could not load profile, continuing as customer:', error.message);

  return (!error && data) || {
    full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
    role: 'customer'
  };
}

function toUser(authUser, profile) {
  return {
    id: authUser.id,
    email: authUser.email,
    full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
    role: profile?.role === 'admin' ? 'admin' : 'customer'
  };
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true); // true while we check for an existing session
  const [bootError, setBootError] = useState('');

  // Runs once when the app opens: is someone already signed in?
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session?.user && !cancelled) {
          setUser(toUser(data.session.user, await getProfile(data.session.user)));
        }
      } catch (err) {
        console.error('FoodFusion startup failed:', err);
        if (!cancelled) setBootError(err.message || 'Could not load your account. Please refresh the page.');
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Returns { notice } when an e-mail confirmation is needed. Throws on errors.
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(toUser(data.user, await getProfile(data.user)));
  }

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;

    if (data.session && data.user) {
      setUser(toUser(data.user, await getProfile(data.user)));
      return { notice: '' };
    }
    return { notice: 'Account created. Check your email to confirm your account, then sign in.' };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }

  return { user, booting, bootError, signIn, signUp, signOut };
}
