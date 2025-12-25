"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Bell, Settings, LogOut, Menu } from "lucide-react";
import { useAppEvent, AppEvents } from "@/lib/app-events";

export function PersianHeader() {
  const { data: session, status, update } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileMenuOpen &&
        !(event.target as Element).closest(".profile-menu")
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

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

  const menuItems = [
    { title: "خانه", href: "/" },
    { title: "درباره ما", href: "/about" },
    { title: "خدمات", href: "/services" },
    { title: "نمونه‌کارها", href: "/portfolio" },
    { title: "راه‌حل‌ها", href: "/solutions" },
    { title: "محصولات", href: "/products" },
    { title: "وبلاگ", href: "/blog" },
    { title: "تماس با ما", href: "/contact" },
  ];

  const authenticatedMenuItems = [
    { title: "داشبورد", href: "/dashboard" },
    { title: "اعلان‌ها", href: "/notifications" },
    ...(session?.user?.role === "ADMIN"
      ? [{ title: "مدیریت", href: "/admin" }]
      : []),
  ];

  return (
    <header className="w-full border-b border-[#37322f]/6 bg-[#f7f5f3] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/jee-logo.png"
                alt="آتی ارتباطات ژی"
                className="h-8 w-auto border border-[#37322f]/20 rounded-lg"
              />
              <span className="text-[#37322f] font-bold text-xl">آتی ارتباطات ژی</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-6">
            {menuItems.slice(0, -1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Medium Screen Navigation - Condensed */}
          <div className="hidden lg:flex xl:hidden items-center gap-4">
            {menuItems.slice(0, 7).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {item.title}
              </Link>
            ))}
            {/* More dropdown for remaining items */}
            <div className="relative group">
              <button className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium transition-colors flex items-center gap-1">
                بیشتر
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {menuItems.slice(7, -1).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-[#37322f] hover:bg-[#37322f]/5 transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#37322f] hover:bg-[#37322f]/5"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12M6 12h12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>

          {/* Authentication Section */}
          <div className="hidden lg:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                {/* Dashboard Link for authenticated users */}
                <Link
                  href="/dashboard"
                  className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium transition-colors"
                >
                  داشبورد
                </Link>

                {/* Notifications */}
                <Link href="/dashboard?tab=notifications" className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#37322f] hover:bg-[#37322f]/5 relative"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* Profile Menu */}
                <div className="relative profile-menu">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 text-[#37322f] hover:bg-[#37322f]/5"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[#37322f]/20">
                      {(() => {
                        console.log("Header - Session user:", session.user); // Debug log
                        console.log(
                          "Header - Session user image:",
                          session.user?.image
                        ); // Debug log
                        return session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "Profile"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log(
                                "Image failed to load:",
                                session.user.image
                              ); // Debug log
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
                        );
                      })()}
                    </div>
                    <span className="text-sm">{session.user?.name}</span>
                  </Button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 profile-menu">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-[#37322f]">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.user?.email}
                          </p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-[#37322f] hover:bg-[#37322f]/5 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          داشبورد
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-[#37322f] hover:bg-[#37322f]/5 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          تنظیمات
                        </Link>
                        {session.user?.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-[#37322f] hover:bg-[#37322f]/5 transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            مدیریت
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut();
                            setIsProfileMenuOpen(false);
                          }}
                          className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          خروج
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  className="text-[#37322f] hover:bg-[#37322f]/5"
                >
                  <Link href="/auth/signin">ورود</Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="bg-[#37322f] hover:bg-[#37322f]/90 text-white"
                >
                  <Link href="/auth/signup">ثبت‌نام</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#37322f]/10 py-4">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium py-2 px-4 rounded-md hover:bg-[#37322f]/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}

              {/* Mobile Authentication Section */}
              <div className="border-t border-[#37322f]/10 pt-4 mt-4">
                {session ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#37322f]/20">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "Profile"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-user.jpg";
                            }}
                          />
                        ) : (
                          <img
                            src="/placeholder-user.jpg"
                            alt={session.user.name || "Profile"}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#37322f]">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Mobile Menu Items */}
                    <Link
                      href="/dashboard"
                      className="block text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium py-2 px-4 rounded-md hover:bg-[#37322f]/5 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      داشبورد
                    </Link>

                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="block text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium py-2 px-4 rounded-md hover:bg-[#37322f]/5 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        مدیریت
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-right text-red-600 hover:text-red-700 text-sm font-medium py-2 px-4 rounded-md hover:bg-red-50 transition-colors"
                    >
                      خروج
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start text-[#37322f] hover:bg-[#37322f]/5"
                    >
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ورود
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="default"
                      className="bg-[#37322f] hover:bg-[#37322f]/90 text-white justify-start"
                    >
                      <Link
                        href="/auth/signup"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        ثبت‌نام
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
