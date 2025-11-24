import LogoSpinner from "@/components/LoadingScreen";
import { decryptData } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { customerinfocheck } from "./AuthRoutes";

type UserData = {
  id: any;
  name: any;
  email: any;
  wallet_balance: any;
  first_name: any;
  last_name: any;
  phone: any;
  userid: any;
  picture: any;
  personal_referal_code: any;
  customer_id: any;
  session_id: any;
  biometric_setup: any;
  transaction_pin_setup: any,
  rc_number: any;
  tin_number: any;
  account_type: any;
  business_id: any;
  company_name: any;
  helper_user_id: any,
  cartcount: any,
  notificationcount: any,
  pushtoken: any
};

type AuthContextType = {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  updateToken: (newToken: string) => Promise<void>;
  updateUser: (newUserData: UserData) => Promise<void>;
  updateUserFields: (updates: Partial<UserData>) => Promise<void>;
  refreshUser: (silent?: boolean) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        setIsLoading(true)
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.log("Failed to restore session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (token: string, userData: UserData) => {
    try {
      setIsLoading(true);
      setToken(token);
      setUser(userData);
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setToken(null);
      setUser(null);
      await AsyncStorage.multiRemove(["userToken", "userData"]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateToken = async (newToken: string) => {
    setToken(newToken);
    await AsyncStorage.setItem("userToken", newToken);
  };

  const updateUser = async (newUserData: UserData) => {
    setUser(newUserData);
    await AsyncStorage.setItem("userData", JSON.stringify(newUserData));
  };

  const updateUserFields = async (updates: Partial<UserData>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  const refreshUser = async (silent = false) => {
    if (!user?.customer_id || !token) return;
    setIsLoading(!silent); // Only show loading if not silent
    try {
      const response = await customerinfocheck(user.customer_id, decryptData(token));
      if (response) {
        if (silent) {
          // Update user without triggering side-effects (like navigation)
          setUser(response); 
          await AsyncStorage.setItem("userData", JSON.stringify(response));
        } else {
          // Normal update
          await updateUser(response);
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  if(isLoading){
    return <LogoSpinner lightColor="" darkColor=""/>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateToken,
        updateUser,
        updateUserFields,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
