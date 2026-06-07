import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { apiClient, unwrapApiData } from "../utils/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await apiClient.get("/users/me");
      const currentUser = unwrapApiData(response);
      setUser(currentUser || null);
      return currentUser || null;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const login = useCallback(async (payload) => {
    const response = await apiClient.post("/users/login", payload);
    const data = unwrapApiData(response);
    setUser(data?.user || null);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/users/logout");
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loadingUser,
      isAuthenticated: Boolean(user),
      refreshUser,
      login,
      logout
    }),
    [user, loadingUser, refreshUser, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
