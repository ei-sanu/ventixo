import { useAuth, useUser } from "@clerk/clerk-react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface DbUser {
  _id: string;
  username: string;
  userId: string;
  email: string;
  role: "user" | "admin";
}

interface DbUserContextType {
  dbUser: DbUser | null;
  loading: boolean;
  refreshDbUser: () => Promise<void>;
}

const DbUserContext = createContext<DbUserContextType | undefined>(undefined);

export function DbUserProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDbUser = async () => {
    if (!isLoaded || !isSignedIn) {
      setDbUser(null);
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setDbUser(json.data.user);
      } else {
        setDbUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch DB user:", error);
      setDbUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbUser();
    // Expose refresh to window for debugging or manual trigger from other components
    (window as any).refreshDbUser = fetchDbUser;
  }, [isLoaded, isSignedIn, user?.id]);

  return (
    <DbUserContext.Provider value={{ dbUser, loading, refreshDbUser: fetchDbUser }}>
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
