"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { account } from "@/lib/appwrite.client";
import { logoutUser } from "@/lib/actions/login.actions";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        await account.get();

        if (isMounted) {
          setIsAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await logoutUser();
      setIsAuthenticated(false);
      router.push("/?mode=login");
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to log out right now. Please try again."
      );
    }
  };

  if (isCheckingSession || !isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col items-end gap-2">
      <Button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="shad-danger-btn min-w-[120px]"
      >
        <LogOut className="size-4" />
        {isLoading ? "Logging out..." : "Logout"}
      </Button>

      {error && <p className="max-w-xs text-right text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default LogoutButton;
