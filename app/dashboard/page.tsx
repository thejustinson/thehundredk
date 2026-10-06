"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Offer = {
  id: string;
  activity_date: string;
  company_name: string;
  person_name: string;
  person_role: string;
  offer_title: string;
  stage: string;
  status: string;
  channel: string;
  deal_value: number;
  is_public: boolean;
};

export default function DashboardPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const router = useRouter();

  useEffect(() => {
    async function fetchOffers() {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('activity_date', { ascending: false });
        
      if (data) {
        setOffers(data);
      }
      setLoading(false);
    }
    fetchOffers();
  }, []);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesSearch = 
        offer.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.person_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.offer_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.person_role?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || offer.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [offers, searchQuery, statusFilter]);

  return (
    <div className="p-8 max-w-[1200px] w-full mx-auto">
      <header className="flex items-center justify-between mb-8 pb-6 border-b border-hairline">
        <div>
          <h1 className="text-2xl font-medium text-ink-strong tracking-tight">Pipeline</h1>
          <p className="text-sm text-ink-subtle mt-1">Manage your active offers and log interactions.</p>
        </div>
        <Link 
          href="/dashboard/offers/new"
          className="h-8 px-4 bg-primary flex items-center justify-center text-white text-[13px] font-medium rounded-md hover:opacity-90 transition-opacity"
        >
          + New Offer
        </Link>
      </header>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search offers, companies, people..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full sm:max-w-xs px-3 bg-canvas border border-hairline-strong rounded-md text-sm text-ink-strong focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-ink-subtle shadow-sm"
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 bg-canvas border border-hairline-strong rounded-md text-sm text-ink-strong focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <div className="bg-canvas border border-hairline rounded-sm shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-hairline bg-surface-2 text-ink-subtle text-xs uppercase tracking-wider font-medium">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Target</th>
              <th className="px-5 py-3 font-medium">Offer</th>
              <th className="px-5 py-3 font-medium">Stage</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-ink-subtle text-sm">
                  Loading pipeline...
                </td>
              </tr>
            ) : filteredOffers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-ink-subtle text-sm">
                  No offers match your criteria.
                </td>
              </tr>
            ) : (
              filteredOffers.map((offer) => (
                <tr 
                  key={offer.id} 
                  onClick={() => router.push(`/dashboard/offers/${offer.id}`)}
                  className="hover:bg-surface/50 transition-colors group cursor-pointer text-sm"
                >
                  <td className="px-5 py-4 text-ink-subtle whitespace-nowrap">
                    {new Date(offer.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-ink-strong">
                      {[offer.person_name, offer.company_name].filter(Boolean).join(' • ') || '—'}
                    </div>
                    <div className="text-[13px] text-ink-subtle mt-0.5">{offer.person_role || '—'}</div>
                  </td>
                  <td className="px-5 py-4 text-ink-strong font-medium">
                    {offer.offer_title}
                  </td>
                  <td className="px-5 py-4">
                    <span className="capitalize">{offer.stage}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[11px] font-medium uppercase tracking-wide
                      ${offer.status.toLowerCase() === 'won' ? 'text-[#0E7A2F] bg-[#CAFACE]' : 
                        (offer.status.toLowerCase() === 'lost' || offer.status.toLowerCase() === 'rejected') ? 'text-primary bg-primary/10' : 
                        'text-ink-strong bg-surface-2'}`
                    }>
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={`text-[11px] font-medium uppercase tracking-wider ${offer.is_public ? 'text-ink-strong' : 'text-ink-subtle'}`}>
                      {offer.is_public ? 'Public' : 'Private'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
