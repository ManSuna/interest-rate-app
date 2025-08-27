// AuthProvider.js
import React, { createContext, useContext, useCallback, useEffect, useState } from "react";

const METADATA_KEY = "metaData";
const BASE_KEY = "backEndBaseURL";

const AuthCtx = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
  error: null,
  setError: () => {},
  metadata: null,
  refetchMetadata: async () => {},
  clearMetadata: () => {},
  metadataLoading: false,
});

const getMetadata = () => {
  const raw = localStorage.getItem(METADATA_KEY);
  return raw ? JSON.parse(raw) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const [metadata, setMetadata] = useState(getMetadata());
  const [metadataLoading, setMetadataLoading] = useState(false);

  const clearMetadata = useCallback(() => {
    localStorage.removeItem(METADATA_KEY);
    setMetadata(null);
  }, []);

  const refetchMetadata = useCallback(async () => {
    const base = localStorage.getItem(BASE_KEY);
    if (!base) return;
    setMetadataLoading(true);
    try {
      const res = await fetch(`${base}/metadata`, { headers: { /* add auth header if needed */ } });
      const data = await res.json();
      localStorage.setItem(METADATA_KEY, JSON.stringify(data));
      setMetadata(data);
    } finally {
      setMetadataLoading(false);
    }
  }, []);

  // cross-tab sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === METADATA_KEY) setMetadata(getMetadata());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async (username, password) => {
    // ... your existing login logic that sets token/user
    // after successful login:
    await refetchMetadata();
    return { success: true };
  };

  const logout = () => {
    // ... your existing logout logic (clear token, user, etc.)
    clearMetadata();
  };

  const value = {
    user, login, logout, error, setError,
    metadata, refetchMetadata, clearMetadata, metadataLoading,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuthenticationContext = () => useContext(AuthCtx);