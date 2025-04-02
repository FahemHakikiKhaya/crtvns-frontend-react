import { createContext, useContext, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";

interface AuthContextType {
  token: string | null;
  userId: number | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );

  useEffect(() => {
    localStorage.setItem("authToken", token || "");
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    enqueueSnackbar("Logout Successfuly", {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "right" },
    });
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
