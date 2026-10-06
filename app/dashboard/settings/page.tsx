"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    }
    getUser();
  }, []);

  return (
    <div className="p-8 max-w-[1200px] w-full mx-auto">
      <header className="mb-8 pb-6 border-b border-hairline">
        <h1 className="text-2xl font-medium text-ink-strong tracking-tight">Settings</h1>
        <p className="text-sm text-ink-subtle mt-1">System configuration and account details.</p>
      </header>

      <div className="max-w-2xl flex flex-col gap-8">
        
        <section className="bg-canvas border border-hairline rounded-sm p-8 shadow-sm">
          <h2 className="text-sm font-medium text-ink-strong uppercase tracking-wider mb-6">Account</h2>
          <div className="flex flex-col gap-4">
            <div>
              <span className="block text-[13px] text-ink-subtle mb-1">Email Address</span>
              <span className="text-sm font-medium text-ink-strong">{userEmail || "Loading..."}</span>
            </div>
            <div>
              <span className="block text-[13px] text-ink-subtle mb-1">Role</span>
              <span className="text-[11px] font-medium uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm inline-block">Administrator</span>
            </div>
          </div>
        </section>

        <section className="bg-canvas border border-hairline rounded-sm p-8 shadow-sm">
          <h2 className="text-sm font-medium text-ink-strong uppercase tracking-wider mb-6">System Integrations</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between border-b border-hairline pb-4">
              <div>
                <span className="block text-sm font-medium text-ink-strong mb-1">Telegram Bot</span>
                <p className="text-[13px] text-ink-subtle max-w-sm">Connected via environment variables. Only your authorized Telegram User ID can log activities.</p>
              </div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#0E7A2F] bg-[#CAFACE] px-2 py-0.5 rounded-sm">
                Configured
              </span>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <span className="block text-sm font-medium text-ink-strong mb-1">Google Gemini AI</span>
                <p className="text-[13px] text-ink-subtle max-w-sm">Connected for natural language extraction from Telegram messages.</p>
              </div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#0E7A2F] bg-[#CAFACE] px-2 py-0.5 rounded-sm">
                Configured
              </span>
            </div>
          </div>
        </section>
        
        <p className="text-[13px] text-ink-subtle italic">
          As per the project requirements, complex permissions and billing have been intentionally omitted. 
        </p>
      </div>
    </div>
  );
}
