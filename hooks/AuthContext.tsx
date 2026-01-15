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
  transaction_pin_setup: any;
  rc_number: any;
  tin_number: any;
  account_type: any;
  business_id: any;
  company_name: any;
  helper_user_id: any;
  cartcount: any;
  notificationcount: any;
  pushtoken: any;
  status: any;
  isBalanceHidden: any,
  commission_balance: any,

  updated_at?: number; // ADDED: timestamp to avoid overwriting new data
};

type AuthContextType = {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  updateToken: (newToken: string) => Promise<void>;
  updateUser: (newUserData: Partial<UserData>) => Promise<void>;
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
        setIsLoading(true);
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

  // LOGIN
  const login = async (token: string, userData: UserData) => {
    try {
      setIsLoading(true);
      const stamped = { ...userData, updated_at: Date.now() };
      setUser(stamped);
      setToken(token);

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(stamped));
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
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

  // UPDATE TOKEN
  const updateToken = async (newToken: string) => {
    setToken(newToken);
    await AsyncStorage.setItem("userToken", newToken);
  };

  // SAFELY UPDATE USER WITHOUT LOSING DATA
  const updateUser = async (newUserData: Partial<UserData>) => {
    if (!user) return;

    const stamped = {
      ...user,
      ...newUserData,
      updated_at: Date.now(),
    };
    console.log("[AuthContext] updateUser REPLACE called — source:", newUserData/* add caller info if possible */);
    setUser(stamped);
    await AsyncStorage.setItem("userData", JSON.stringify(stamped));
  };

  // UPDATE ONLY CERTAIN FIELDS
  const updateUserFields = async (updates: Partial<UserData>) => {
    if (!user) return;

    const merged = {
      ...user,
      ...updates,
      updated_at: Date.now(),
    };
    // inside updateUserFields
    console.log("[AuthContext] updateUserFields called, updates:", updates);
    setUser(merged);
    await AsyncStorage.setItem("userData", JSON.stringify(merged));
  };

  // REFRESH USER FROM SERVER SAFELY
  const refreshUser = async (silent = false) => {
    if (!user?.customer_id || !token) return;

    if (!silent) setIsLoading(true);

    try {
      const serverData = await customerinfocheck(
        user.customer_id,
        decryptData(token)
      );

      if (!serverData) return;

      // Prevent overwriting LOCAL changes with older server data
      const merged = {
        ...user,
        ...serverData,
      };

      // Keep the newer timestamps
      merged.updated_at = Date.now();

      setUser(merged);
      await AsyncStorage.setItem("userData", JSON.stringify(merged));
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LogoSpinner lightColor="" darkColor="" />;
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
