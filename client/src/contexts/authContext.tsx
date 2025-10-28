import { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { axiosConfig } from "../config/axiosConfig";
import { UserInterface } from "@/interfaces/User";

const AuthContext = createContext<{
  authUser: UserInterface | null;
  setAuthUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
}>({
  authUser: null,
  setAuthUser: () => {},
  loading: true,
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const getAuthUser = async () => {
    console.log("🔍 Starting auth check...");
    
    // Vérifier si un token existe
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("⚠️ No token found, skipping auth check");
      setAuthUser(null);
      setLoading(false); // ⬅️ ICI
      return;
    }
    
    try {
      console.log("📡 Calling /authentication/me...");
      const userResponse = await axiosConfig.get("/auth/me");
      const userData = userResponse.data;
      console.log("✅ User found:", userData);
      setAuthUser(userData);
    } catch (error: any) {
      console.log("❌ Auth failed:", error.response?.status, error.message);
      setAuthUser(null);
      localStorage.removeItem("accessToken");
    } finally {
      console.log("✅ Loading set to false");
      setLoading(false); // ⬅️ ET ICI
    }
  };

  getAuthUser();
}, []);
  
  return <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>{children}</AuthContext.Provider>;
};