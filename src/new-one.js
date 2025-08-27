import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [metadata, setMetadata] = useState(
    JSON.parse(localStorage.getItem("metadata")) || null
  );

  // Load metadata once on app startup
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/services/metadata");
        if (response.ok) {
          const data = await response.json();
          setMetadata(data);
          localStorage.setItem("metadata", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    };

    if (!metadata) {
      fetchMetadata();
    }
  }, [metadata]);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    // 🚨 if you want metadata to stay available on landing page, DON'T remove it
    // localStorage.removeItem("metadata"); <-- remove only if you want fresh reload every time
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, metadata }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);