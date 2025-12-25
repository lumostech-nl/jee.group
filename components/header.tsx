"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppEvent, AppEvents } from "@/lib/app-events";

export function Header() {
  const { data: session, status, update } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user) {
      fetchUnreadCount();
    }
  }, [session]);

  // Listen for notification updates from other components
  useAppEvent(AppEvents.NOTIFICATION_READ, (data) => {
    setUnreadCount(data.newUnreadCount);
  });

  // Listen for user profile updates
  useAppEvent(AppEvents.USER_PROFILE_UPDATED, async () => {
    // Manually update the session to reflect changes
    await update();
  });

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <header className="w-full border-b border-[#37322f]/6 bg-[#f7f5f3]">
      <div className="max-w-[1060px] mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-[#37322f] font-semibold text-lg">
              E-commerce
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/products"
                className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium"
              >
                Contact
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              {session?.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="relative text-[#37322f] hover:bg-[#37322f]/5"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-[#37322f]/20">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "Profile"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-user.jpg";
                        }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <img
                        src="/placeholder-user.jpg"
                        alt={session.user.name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-[#37322f] text-sm">
                    Hello, {session.user?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="text-[#37322f] hover:bg-[#37322f]/5"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    className="text-[#37322f] hover:bg-[#37322f]/5"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-[#37322f] text-white hover:bg-[#37322f]/90">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
