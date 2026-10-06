"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas justify-center items-center px-4">
      <Link href="/" className="absolute top-8 left-8 text-sm font-medium text-ink-subtle hover:text-ink-strong transition-colors flex items-center gap-2">
        <span>←</span> Back to Public Journey
      </Link>
      
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-medium tracking-tight text-ink-strong mb-3">
            The Hundred K
          </h1>
          <p className="text-ink-subtle text-sm">
            Private Dashboard Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink-strong" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 px-3 bg-canvas border border-hairline-strong rounded-md text-sm text-ink-strong focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-ink-subtle shadow-sm"
              placeholder="justin@example.com"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink-strong" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 px-3 bg-canvas border border-hairline-strong rounded-md text-sm text-ink-strong focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-danger-fill/20 border border-danger/30 text-[13px] font-medium px-3 py-2 rounded-sm mt-1" style={{ color: '#D92D20', backgroundColor: '#FFE8E6' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="h-10 w-full mt-4 bg-ink-strong text-white rounded-md text-[13px] font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
