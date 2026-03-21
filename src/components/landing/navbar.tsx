"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <span className="text-lg font-bold tracking-tight">HireLens</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-5 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link href="/analyze">
              <Button size="sm" variant="secondary">Analyze Resume</Button>
            </Link>
            {!loading && user ? (
              <>
                <Link
                  href="/jobs"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Briefcase size={14} />
                  Jobs
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <User size={14} />
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign Out
                </button>
              </>
            ) : !loading ? (
              <Button size="sm" onClick={() => setAuthOpen(true)}>
                Sign In
              </Button>
            ) : null}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border bg-background md:hidden"
            >
              <div className="flex flex-col gap-4 px-4 py-4">
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-sm text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  How It Works
                </Link>
                <Link href="/analyze" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" variant="secondary" className="w-full">
                    Analyze Resume
                  </Button>
                </Link>
                {!loading && user ? (
                  <>
                    <Link
                      href="/jobs"
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Briefcase size={14} />
                      Jobs For You
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      <User size={14} />
                      My Profile
                    </Link>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="text-left text-sm text-muted-foreground"
                    >
                      Sign Out
                    </button>
                  </>
                ) : !loading ? (
                  <Button
                    size="sm"
                    className="w-full"
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
