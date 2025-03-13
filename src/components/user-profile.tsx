"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function DashboardPage() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize router

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
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    if (error === "Not authenticated") {
      router.push("/auth/login"); // Redirect to login page if not authenticated
    }
  }, [error, router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex">
        <Avatar className="h-10 w-10 shrink-0 ">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-gradient-to-br rounded-full p-2 from-orange-400 to-amber-500 text-white">
            ॐ
          </AvatarFallback>
        </Avatar>
        <h1> {user.name}</h1>
      </div>

      <p>{user.email}</p>
    </div>
  );
}
