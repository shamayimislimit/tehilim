import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchMe, requestMagicLink } from '@/lib/api';

const TOKEN_KEY = 'tehilim-auth-token';

interface User {
  id: string;
  email: string;
}

interface AuthValue {
  token: string | null;
  user: User | null;
  ready: boolean; // initial token/user resolution finished
  requestLogin: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export const useAuth = (): AuthValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

/** Pull `#token=<jwt>` left by the magic-link callback, then clean the URL. */
const consumeTokenFromHash = (): string | null => {
  const hash = window.location.hash;
  const match = hash.match(/[#&]token=([^&]+)/);
  if (!match) return null;
  const token = decodeURIComponent(match[1]);
  const cleaned = hash.replace(/([#&])token=[^&]+/, '$1').replace(/[#&]$/, '');
  history.replaceState(null, '', window.location.pathname + window.location.search + cleaned);
  return token;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fromHash = consumeTokenFromHash();
    const stored = fromHash ?? localStorage.getItem(TOKEN_KEY);
    if (fromHash) localStorage.setItem(TOKEN_KEY, fromHash);
    if (!stored) {
      setReady(true);
      return;
    }
    setToken(stored);
    fetchMe(stored)
      .then((u) => {
        if (u) setUser(u);
        else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      })
      .catch(() => {/* keep token; transient network error */})
      .finally(() => setReady(true));
  }, []);

  const requestLogin = useCallback(async (email: string) => {
    // Return the user to the page they're on (sans hash résiduel).
    const redirect = window.location.origin + window.location.pathname + window.location.search;
    await requestMagicLink(email, redirect);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, ready, requestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
