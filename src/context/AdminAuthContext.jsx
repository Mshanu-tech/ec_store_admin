import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("fc_admin_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/admin-login", { email, password });
      localStorage.setItem("fc_admin_token", data.token);
      localStorage.setItem("fc_admin_user", JSON.stringify(data.user));
      setAdmin(data.user);
      toast.success("Welcome back, Admin");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("fc_admin_token");
    localStorage.removeItem("fc_admin_user");
    setAdmin(null);
  };

  return <AdminAuthContext.Provider value={{ admin, login, logout }}>{children}</AdminAuthContext.Provider>;
}

export const useAdminAuth = () => useContext(AdminAuthContext);
