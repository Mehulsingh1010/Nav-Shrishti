"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setUser(data);
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          err.message === "Not authenticated" &&
          !["/auth/login", "/auth/register", "/"].includes(pathname) // Allow login & register pages
        ) {
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
