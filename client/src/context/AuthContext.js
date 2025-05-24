import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); // ✅ finish loading
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children} {/* ✅ only show routes when ready */}
    </AuthContext.Provider>
  );
};
