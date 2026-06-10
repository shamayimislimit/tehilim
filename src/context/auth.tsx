import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchMe, requestCode as apiRequestCode, verifyCode as apiVerifyCode } from '@/lib/api';

const TOKEN_KEY = 'tehilim-auth-token';

interface User {
  id: string;
  email: string;
}

interface AuthValue {
  token: string | null;
  user: User | null;
  ready: boolean; // initial token/user resolution finished
  /** Email a 6-digit login code. */
  requestCode: (email: string) => Promise<void>;
  /** Verify the code and open the session. Throws Error(<backend key>) on failure. */
  verifyCode: (email: string, code: string) => Promise<void>;
  logout: () => void;
  /** Shared login-dialog visibility, so any component can prompt login. */
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
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
  const [loginOpen, setLoginOpen] = useState(false);

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

  const requestCode = useCallback(async (email: string) => {
    await apiRequestCode(email);
  }, []);

  const verifyCode = useCallback(async (email: string, code: string) => {
    const { token: jwt, user: u } = await apiVerifyCode(email, code);
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, ready, requestCode, verifyCode, logout, loginOpen, setLoginOpen }}>
      {children}
    </AuthContext.Provider>
  );
};
