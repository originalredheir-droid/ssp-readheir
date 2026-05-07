import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  getIdToken,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  fetchCurrentUser,
  loadTokenFromStorage,
  logoutUser as apiLogout,
  loginUser as apiLogin,
  registerUser as apiRegister,
  firebaseAuth,
  type LoginPayload,
  type RegisterPayload,
  type User,
} from "../api/auth";

interface AuthContextValue {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        const idToken = await getIdToken(firebaseUser);
        setToken(idToken);
        localStorage.setItem("ssp_token", idToken);
        // Authenticate with Django
        try {
          await firebaseAuth(idToken);
          const djangoUser = await fetchCurrentUser();
          setUser(djangoUser);
        } catch {
          setUser(null);
        }
      } else {
        setFirebaseUser(null);
        setToken(null);
        setUser(null);
        localStorage.removeItem("ssp_token");
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = useCallback(async () => {
    if (firebaseUser) {
      const idToken = await getIdToken(firebaseUser);
      setToken(idToken);
      try {
        await firebaseAuth(idToken);
        const data = await fetchCurrentUser();
        setUser(data);
      } catch {
        setUser(null);
      }
    }
  }, [firebaseUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, payload.username, payload.password);
      // Firebase auth state change will handle the rest
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, payload.username, payload.password);
      // After Firebase registration, call Django register
      const idToken = await getIdToken(auth.currentUser!);
      await apiRegister({ ...payload, id_token: idToken });
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Firebase auth state change will handle the rest
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut(auth);
    apiLogout();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      firebaseUser,
      token,
      loading,
      initialized,
      login,
      register,
      loginWithGoogle,
      logout,
      refreshUser,
    }),
    [user, firebaseUser, token, loading, initialized, login, register, loginWithGoogle, logout, refreshUser]
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
