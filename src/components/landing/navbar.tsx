"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Briefcase,
  User,
  ClipboardList,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
  ];

  const userLinks = [
    { href: "/jobs", label: "Job Board", icon: Briefcase },
    { href: "/applications", label: "Applications", icon: ClipboardList },
    { href: "/profile", label: "My Profile", icon: User },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="border-b border-white/[0.04] bg-background/70 backdrop-blur-2xl backdrop-saturate-150">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 transition-shadow group-hover:shadow-primary/40">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Hire<span className="text-primary">Lens</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}

              <div className="mx-2 h-4 w-px bg-border" />

              <Link href="/analyze">
                <Button size="sm" variant="secondary" className="text-[13px] h-8">
                  Analyze Resume
                </Button>
              </Link>

              {!loading && user ? (
                <>
                  <div className="mx-1 h-4 w-px bg-border" />

                  {/* Compact nav pills */}
                  <div className="flex items-center gap-0.5 rounded-lg bg-white/[0.03] p-0.5">
                    {userLinks.slice(0, 2).map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                      >
                        <l.icon size={13} />
                        {l.label}
                      </Link>
                    ))}
                  </div>

                  {/* User avatar dropdown */}
                  <div className="relative ml-1" ref={menuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-accent/80 text-[11px] font-bold text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown
                        size={12}
                        className={`text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/50"
                        >
                          <div className="border-b border-border px-3 py-2.5">
                            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <div className="p-1">
                            {userLinks.map((l) => (
                              <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                              >
                                <l.icon size={14} />
                                {l.label}
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-border p-1">
                            <button
                              onClick={() => { signOut(); setUserMenuOpen(false); }}
                              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-red-400 transition-colors hover:bg-red-500/5"
                            >
                              <LogOut size={14} />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : !loading ? (
                <Button size="sm" onClick={() => setAuthOpen(true)} className="ml-2 h-8 text-[13px]">
                  Sign In
                </Button>
              ) : null}
            </div>

            {/* Mobile toggle */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.04] md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-b border-border bg-card/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-3">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}

                <Link href="/analyze" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" variant="secondary" className="mt-1 w-full">
                    Analyze Resume
                  </Button>
                </Link>

                {!loading && user ? (
                  <>
                    <div className="my-1 h-px bg-border" />
                    {userLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04]"
                        onClick={() => setMobileOpen(false)}
                      >
                        <l.icon size={15} />
                        {l.label}
                      </Link>
                    ))}
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/5"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </>
                ) : !loading ? (
                  <Button
                    size="sm"
                    className="mt-1 w-full"
                    onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                  >
                    Sign In
                  </Button>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
