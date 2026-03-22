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
  FileText,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    { href: "/cover-letter", label: "Cover Letter", icon: FileText },
    { href: "/applications", label: "Applications", icon: ClipboardList },
    { href: "/profile", label: "My Profile", icon: User },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className={`border-b transition-all duration-300 ease-out ${
            scrolled
              ? "border-white/[0.06] bg-background/80 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_20px_rgba(0,0,0,0.25)]"
              : "border-transparent bg-transparent backdrop-blur-none"
          }`}
        >
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/25 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/35">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-[15px] font-bold tracking-tight">
                Hire<span className="text-primary">Lens</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="relative rounded-lg px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}

              <div className="mx-2.5 h-3.5 w-px bg-white/[0.06]" />

              <Link href="/analyze">
                <Button size="sm" variant="secondary" className="h-8 text-[12px] px-3">
                  Analyze Resume
                </Button>
              </Link>

              {!loading && user ? (
                <>
                  <div className="mx-1.5 h-3.5 w-px bg-white/[0.06]" />

                  <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.04] bg-white/[0.02] p-0.5">
                    {userLinks.slice(0, 2).map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                      >
                        <l.icon size={12} />
                        {l.label}
                      </Link>
                    ))}
                  </div>

                  {/* User avatar dropdown */}
                  <div className="relative ml-1" ref={menuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-accent/80 text-[10px] font-bold text-white ring-2 ring-background">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown
                        size={11}
                        className={`text-muted-foreground transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-white/[0.06] bg-card/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
                        >
                          <div className="border-b border-white/[0.04] px-3 py-2">
                            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <div className="p-1">
                            {userLinks.map((l) => (
                              <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                              >
                                <l.icon size={13} />
                                {l.label}
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-white/[0.04] p-1">
                            <button
                              onClick={() => { signOut(); setUserMenuOpen(false); }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] text-red-400 transition-colors hover:bg-red-500/5"
                            >
                              <LogOut size={13} />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : !loading ? (
                <Button size="sm" onClick={() => setAuthOpen(true)} className="ml-2 h-8 text-[12px] px-3.5">
                  Sign In
                </Button>
              ) : null}
            </div>

            {/* Mobile toggle */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06] md:hidden"
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
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden border-b border-white/[0.06] bg-background/95 backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-0.5 px-4 py-3">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}

                <Link href="/analyze" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" variant="secondary" className="mt-1.5 w-full">
                    Analyze Resume
                  </Button>
                </Link>

                {!loading && user ? (
                  <>
                    <div className="my-2 h-px bg-white/[0.04]" />
                    {userLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        <l.icon size={15} />
                        {l.label}
                      </Link>
                    ))}
                    <div className="my-2 h-px bg-white/[0.04]" />
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
                    className="mt-1.5 w-full"
                    onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                  >
                    Sign In
                  </Button>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
