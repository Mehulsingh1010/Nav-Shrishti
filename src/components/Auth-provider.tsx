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

const publicRoutes = [
  "/",
  "/navlinks",
  "/navlinks/contact",
  "/navlinks/about",
  "/navlinks/gallery",
  "/navlinks/products",
  "/navlinks/events",
  "/navlinks/services",
  "/navlinks/services/aashram",
  "/navlinks/services/product-listing",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

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
          !publicRoutes.includes(pathname) // Allow all public routes
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
