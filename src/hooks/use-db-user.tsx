import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getAuthToken, removeAuthToken } from "@/lib/auth";

interface DbUser {
  _id: string;
  username: string;
  userId: string;
  email: string;
  role: "user" | "admin";
  createdEvents?: string[];
}

interface DbUserContextType {
  dbUser: DbUser | null;
  loading: boolean;
  isSignedIn: boolean;
  refreshDbUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const DbUserContext = createContext<DbUserContextType | undefined>(undefined);

export function DbUserProvider({ children }: { children: React.ReactNode }) {
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const fetchDbUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setDbUser(null);
      setIsSignedIn(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setDbUser(json.data.user);
        setIsSignedIn(true);
      } else {
        setDbUser(null);
        setIsSignedIn(false);
        if (response.status === 401) {
          removeAuthToken();
        }
      }
    } catch (error) {
      console.error("Failed to fetch DB user:", error);
      setDbUser(null);
      setIsSignedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      removeAuthToken();
      setDbUser(null);
      setIsSignedIn(false);
    }
  }, []);

  useEffect(() => {
    fetchDbUser();
    (window as any).refreshDbUser = fetchDbUser;
  }, [fetchDbUser]);

  return (
    <DbUserContext.Provider
      value={{
        dbUser,
        loading,
        isSignedIn,
        refreshDbUser: fetchDbUser,
        logout,
      }}
    >
      {children}
    </DbUserContext.Provider>
  );
}

export function useDbUser() {
  const context = useContext(DbUserContext);
  if (context === undefined) {
    throw new Error("useDbUser must be used within a DbUserProvider");
  }
  return context;
}
