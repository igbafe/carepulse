"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { account } from "@/lib/appwrite.client";
import { logoutUser } from "@/lib/actions/login.actions";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shouldHideOnPage =
    pathname === "/" || /^\/patients\/[^/]+\/register$/.test(pathname);

  useEffect(() => {
    let isMounted = true;

    if (shouldHideOnPage) {
      setIsAuthenticated(false);
      setIsCheckingSession(false);
      setError(null);

      return () => {
        isMounted = false;
      };
    }

    setIsCheckingSession(true);

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
  }, [shouldHideOnPage]);

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

  if (shouldHideOnPage || isCheckingSession || !isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col items-end gap-2">
      <div className="rounded-2xl border border-dark-500 bg-dark-200/95 p-2 shadow-lg backdrop-blur-sm">
        <Button
          type="button"
          onClick={handleLogout}
          disabled={isLoading}
          variant="ghost"
          className="group min-w-[132px] rounded-xl border border-transparent bg-dark-400 px-4 text-light-200 hover:border-green-500/30 hover:bg-dark-300 hover:text-green-500"
        >
          <LogOut className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {error && (
        <p className="max-w-xs rounded-xl border border-red-600/40 bg-red-600/10 px-3 py-2 text-right text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default LogoutButton;
