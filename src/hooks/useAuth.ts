import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getUserRole } from '../lib/services';

interface AuthState {
  user: User | null;
  role: 'admin' | 'user' | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, role: null, loading: true });

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION immediately with the current session,
    // so there is no need for a separate getSession() call — that caused a race
    // condition where the listener could fire with null before getSession resolved,
    // briefly redirecting an authenticated user to /login on page refresh.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Skip re-fetching the role on token refresh — it cannot change mid-session.
        if (event === 'TOKEN_REFRESHED') {
          setState((prev) => ({ ...prev, user: session.user, loading: false }));
          return;
        }
        try {
          const role = await getUserRole(session.user.id);
          setState({ user: session.user, role, loading: false });
        } catch (e) {
          console.error('Error validando rol:', e);
          setState({ user: session.user, role: 'user', loading: false });
        }
      } else {
        setState({ user: null, role: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
