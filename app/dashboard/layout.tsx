"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const getLinkClass = (path: string) => {
    // Pipeline is active for exactly "/dashboard" or any sub-route under "/dashboard/offers"
    const isActive = 
      path === "/dashboard" 
        ? pathname === "/dashboard" || pathname.startsWith("/dashboard/offers")
        : pathname === path;
        
    return `h-8 flex items-center px-3 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-surface-2 text-ink-strong" : "text-ink hover:bg-surface"
    }`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <span className="text-ink-subtle text-sm">Authenticating...</span>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar Nav */}
      <aside className="w-[240px] border-r border-hairline flex flex-col justify-between bg-canvas">
        <div>
          <div className="px-6 py-6 border-b border-hairline mb-4">
            <div className="font-medium text-ink-strong tracking-tight">THE HUNDRED K</div>
            <div className="text-[11px] text-primary uppercase tracking-wider mt-1 font-medium">Operating System</div>
          </div>
          
          <nav className="flex flex-col gap-1 px-3">
            <Link href="/dashboard" className={getLinkClass("/dashboard")}>Pipeline</Link>
            <Link href="/dashboard/stats" className={getLinkClass("/dashboard/stats")}>Statistics</Link>
            <Link href="/dashboard/settings" className={getLinkClass("/dashboard/settings")}>Settings</Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-hairline">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="h-8 w-full flex items-center px-3 rounded-md text-ink hover:bg-surface-2 text-sm font-medium transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
