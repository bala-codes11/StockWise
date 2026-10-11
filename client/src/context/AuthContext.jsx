
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("stockwise_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem("stockwise_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email: email.trim(),
      password,
    });

    localStorage.setItem("stockwise_token", data.token);
    setUser(data.user);

    return data;
  };

  // FIX: Accept the object sent by Register.jsx
  const register = async ({ name, email, password }) => {
    const { data } = await api.post("/auth/register", {
      name: name.trim(),
      email: email.trim(),
      password,
    });

    localStorage.setItem("stockwise_token", data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("stockwise_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
