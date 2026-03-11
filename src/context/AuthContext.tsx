import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
}

type Role = "vendor" | "reviewer";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (user: User, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  /* Restore login when page reloads */

  useEffect(() => {
    const storedUser = localStorage.getItem("reviewit_user");
    const storedRole = localStorage.getItem("reviewit_role");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedRole === "vendor" || storedRole === "reviewer") {
      setRole(storedRole);
    }
  }, []);

  const login = (userData: User, roleData: Role) => {

    setUser(userData);
    setRole(roleData);

    localStorage.setItem("reviewit_user", JSON.stringify(userData));
    localStorage.setItem("reviewit_role", roleData);
  };

  const logout = () => {

    setUser(null);
    setRole(null);

    localStorage.removeItem("reviewit_user");
    localStorage.removeItem("reviewit_role");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};