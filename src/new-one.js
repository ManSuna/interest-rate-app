import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

async function getMetadata(token) {
  const res = await fetch("/services/metadata", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Failed to fetch metadata");
  return res.json();
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [metadata, setMetadata] = useState(
    JSON.parse(localStorage.getItem("metadata") || "null")
  );

  // 1) Public (unauth) metadata for landing page
  useEffect(() => {
    let cancelled = false;
    const loadPublic = async () => {
      try {
        // Only fetch if we don't already have something cached
        if (!metadata) {
          const data = await getMetadata(null);
          if (!cancelled) {
            setMetadata(data);
            localStorage.setItem("metadata", JSON.stringify(data));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadPublic();
    return () => { cancelled = true; };
  }, []); // run once

  // Helper to refresh metadata (stale-while-revalidate style)
  const refreshMetadata = async (withToken) => {
    try {
      const data = await getMetadata(withToken || token || null);
      setMetadata(data);
      localStorage.setItem("metadata", JSON.stringify(data));
    } catch (e) {
      console.error("Metadata refresh failed:", e);
    }
  };

  // 2) Login → set token/user, then refetch user-scoped metadata
  const login = async (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    // Keep current metadata instantly, then refresh in background:
    refreshMetadata(newToken);
  };

  // 3) Logout → clear auth; optionally fall back to public metadata
  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    // Either keep last metadata for the landing page, OR fetch fresh public:
    // Option A (keep): do nothing.
    // Option B (fresh public): await refreshMetadata(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, metadata, refreshMetadata }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);