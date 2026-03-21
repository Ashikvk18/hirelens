"use client";

import { useState } from "react";
import { useAuth } from "./auth-provider";
import { AuthModal } from "./auth-modal";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, History } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-secondary" />
    );
  }

  if (!user) {
    return (
      <>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowAuth(true)}
          className="gap-2"
        >
          <LogIn size={14} />
          Sign In
        </Button>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/history">
        <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
          <History size={13} />
          History
        </Button>
      </Link>
      <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 py-1 pl-1 pr-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          <User size={12} />
        </div>
        <span className="max-w-[120px] truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={signOut}
        className="gap-1.5 text-xs text-muted-foreground"
      >
        <LogOut size={13} />
      </Button>
    </div>
  );
}
