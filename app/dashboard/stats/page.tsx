"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Stats = {
  totalOffers: number;
  activeOffers: number;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  responseRate: number;
  winRate: number;
  avgDealSize: number;
};

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function calculateStats() {
      const { data, error } = await supabase.from('offers').select('*');
      
      if (data) {
        const total = data.length;
        const active = data.filter(o => o.status === 'pending').length;
        const won = data.filter(o => o.status === 'won');
        const lost = data.filter(o => o.status === 'lost' || o.status === 'rejected');
        
        // Revenue calculations
        const revenue = won.reduce((sum, o) => sum + (Number(o.deal_value) || 0), 0);
        const avgDealSize = won.length > 0 ? revenue / won.length : 0;
        
        // Response logic: any offer that has progressed past the initial 'contacted' stage
        const responded = data.filter(o => o.stage !== 'contacted').length;
        const responseRate = total > 0 ? (responded / total) * 100 : 0;

        // Win rate logic: won / (won + lost)
        const closedDeals = won.length + lost.length;
        const winRate = closedDeals > 0 ? (won.length / closedDeals) * 100 : 0;

        setStats({
          totalOffers: total,
          activeOffers: active,
          dealsWon: won.length,
          dealsLost: lost.length,
          revenue,
          responseRate,
          winRate,
          avgDealSize
        });
      }
      setLoading(false);
    }
    
    calculateStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-[1200px] w-full mx-auto">
        <header className="mb-8 pb-6 border-b border-hairline">
          <h1 className="text-2xl font-medium text-ink-strong tracking-tight">Statistics</h1>
          <p className="text-sm text-ink-subtle mt-1">Aggregated metrics across your entire pipeline.</p>
        </header>
        <div className="text-sm text-ink-subtle">Calculating metrics...</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-8 max-w-[1200px] w-full mx-auto">
      <header className="mb-12 pb-6 border-b border-hairline">
        <h1 className="text-2xl font-medium text-ink-strong tracking-tight">Statistics</h1>
        <p className="text-sm text-ink-subtle mt-1">Aggregated metrics across your entire pipeline.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Core Volume */}
        <div className="bg-canvas border border-hairline rounded-sm p-6 shadow-sm">
          <span className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Total People Reached</span>
          <div className="text-4xl font-medium text-ink-strong mt-2 tabular-nums">
            {stats.totalOffers.toLocaleString()}
          </div>
          <span className="text-xs text-ink-subtle mt-2 block">/ 100,000 Target</span>
        </div>

        <div className="bg-canvas border border-hairline rounded-sm p-6 shadow-sm">
          <span className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Active Pipeline</span>
          <div className="text-4xl font-medium text-ink-strong mt-2 tabular-nums">
            {stats.activeOffers.toLocaleString()}
          </div>
          <span className="text-xs text-ink-subtle mt-2 block">Offers currently pending</span>
        </div>
        
        {/* Financials */}
        <div className="bg-canvas border border-hairline rounded-sm p-6 shadow-sm">
          <span className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Total Revenue</span>
          <div className="text-4xl font-medium text-ink-strong mt-2 tabular-nums">
            ${stats.revenue.toLocaleString()}
          </div>
          <span className="text-xs text-ink-subtle mt-2 block">From {stats.dealsWon} closed deals</span>
        </div>
        
        <div className="bg-canvas border border-hairline rounded-sm p-6 shadow-sm">
          <span className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Avg Deal Size</span>
          <div className="text-4xl font-medium text-ink-strong mt-2 tabular-nums">
            ${stats.avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <span className="text-xs text-ink-subtle mt-2 block">Across winning offers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversion Metrics */}
        <div className="bg-surface-2 border border-hairline rounded-sm p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Response Rate</span>
              <div className="text-3xl font-medium text-ink-strong mt-1 tabular-nums">
                {stats.responseRate.toFixed(1)}%
              </div>
            </div>
            <span className="text-xs text-ink-subtle mb-1.5">Beyond initial contact</span>
          </div>
        </div>

        <div className="bg-surface-2 border border-hairline rounded-sm p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Win Rate</span>
              <div className="text-3xl font-medium text-[#0E7A2F] mt-1 tabular-nums">
                {stats.winRate.toFixed(1)}%
              </div>
            </div>
            <span className="text-xs text-ink-subtle mb-1.5">Of closed deals</span>
          </div>
        </div>

        <div className="bg-surface-2 border border-hairline rounded-sm p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)]">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-medium text-ink-subtle uppercase tracking-wider">Rejections</span>
              <div className="text-3xl font-medium text-primary mt-1 tabular-nums">
                {stats.dealsLost}
              </div>
            </div>
            <span className="text-xs text-ink-subtle mb-1.5">Lost or rejected</span>
          </div>
        </div>
      </div>

    </div>
  );
}
