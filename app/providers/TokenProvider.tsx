"use client";

import { SERVER_URL_BASE_URL } from "@/constants";
import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { resetUser } from "@/redux/reducers/user";
import { resetRestaurant } from "@/redux/reducers/restaurant";
import { useAppDispatch } from "@/hooks/use-rtk";

interface TokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const TokenContext = createContext<TokenContextType>({
  token: null,
  setToken: () => {},
});

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Refresh token logic
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      console.log("⏱ Refreshing token...");
      toast.success("Session refreshed.");
      refreshToken(token);
    }, 110 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  const refreshToken = async (oldToken: string) => {
    try {
      const response = await axios.post(
        `${SERVER_URL_BASE_URL}/api/account/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${oldToken}`,
          },
        }
      );
      const newToken = response.data?.token;
      if (newToken) {
        Cookies.set("token", newToken);
        console.log("✅ Token refreshed");
      } else {
        dispatch(resetUser());
        dispatch(resetRestaurant());
        Cookies.remove("token");
        window.location.reload();
        console.warn("⚠️ Refresh failed. Logging out.");
        setToken(null);
      }
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
