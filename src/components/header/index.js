"use client";

import { useState, useEffect } from "react"; 
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { AlignJustify, Moon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

function Header({ user, profileInfo }) {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); 
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuItems = [
    { label: "Home", path: "/", show: true },
    { label: "Feed", path: "/feed", show: profileInfo },
    { label: "Login", path: "/sign-in", show: !user },
    { label: "Register", path: "/sign-up", show: !user },
    { label: "Activity", path: "/activity", show: profileInfo?.role === "candidate" },
    { label: "Companies", path: "/companies", show: profileInfo?.role === "candidate" },
    { label: "Jobs", path: "/jobs", show: profileInfo },
    { label: "Membership", path: "/membership", show: profileInfo },
    { label: "Account", path: "/account", show: profileInfo },
  ];

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
        ${scrolled 
            ? "bg-white/80 dark:bg-black/50 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm" 
            : "bg-transparent border-b border-transparent"
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex h-20 items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="lg:hidden mr-2">
                <AlignJustify className="h-6 w-6" />
                <span className="sr-only">Toggle Navigation Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white/90 dark:bg-black/80 backdrop-blur-lg">
              <Link className="mr-6 flex items-center" href={"/"}>
                <h3 className="font-bold text-2xl">HireHub</h3>
              </Link>
              <div className="grid gap-2 py-6">
                {menuItems.map((menuItem, index) =>
                  menuItem.show ? (
                    <Link
                      key={index}
                      href={menuItem.path}
                      className="flex w-full items-center py-2 text-lg font-semibold"
                    >
                      {menuItem.label}
                    </Link>
                  ) : null
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link className="hidden font-bold text-3xl lg:flex" href={"/"}>
            HireHub
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex gap-6 items-center">
            {menuItems.map((menuItem, index) =>
              menuItem.show ? (
                <Link
                  key={index}
                  href={menuItem.path}
                  onClick={() => sessionStorage.removeItem("filterParams")}
                  className="group inline-flex h-9 w-max items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                >
                  {menuItem.label}
                </Link>
              ) : null
            )}
          </nav>
          <div className="flex items-center gap-4">
            <Moon
              className="cursor-pointer h-6 w-6 transition-colors hover:text-indigo-500"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            />
            {user && <UserButton afterSignOutUrl="/" />}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;