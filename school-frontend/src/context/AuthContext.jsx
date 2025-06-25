import React, { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Context Creation
const AuthContext = createContext();

// 2️⃣ Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // 3️⃣ Login Method
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // 4️⃣ Logout Method
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // 5️⃣ Rehydrate from localStorage if needed
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (!user && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (!token && storedToken) {
      setToken(storedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ only on mount

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6️⃣ Custom Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
