import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchCurrentUser,
  loadTokenFromStorage,
  logoutUser as apiLogout,
  loginUser as apiLogin,
  registerUser as apiRegister,
  type LoginPayload,
  type RegisterPayload,
  type User,
} from "../api/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedToken = loadTokenFromStorage();
    if (!storedToken) {
      setLoading(false);
      setInitialized(true);
      return;
    }
    setToken(storedToken);
    fetchCurrentUser()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        apiLogout();
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
        setInitialized(true);
      });
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const data = await apiLogin(payload);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const data = await apiRegister(payload);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      initialized,
      login,
      register,
      logout,
    }),
    [user, token, loading, initialized, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
