"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewOfferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    person_name: "",
    person_role: "",
    offer_title: "",
    offer_description: "",
    stage: "contacted",
    status: "pending",
    is_public: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.from('offers').insert({
      ...formData,
      created_by: user?.id,
    }).select().single();

    if (!error && data) {
      // Create initial event
      await supabase.from('offer_events').insert({
        offer_id: data.id,
        event_type: "Offer Created",
        new_stage: formData.stage,
        created_by: user?.id,
      });
      router.push(`/dashboard/offers/${data.id}`);
    } else {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-[800px] w-full mx-auto">
      <Link href="/dashboard" className="text-[13px] text-ink-subtle hover:text-ink-strong mb-6 inline-block">
        ← Back to Pipeline
      </Link>
      
      <h1 className="text-2xl font-medium text-ink-strong tracking-tight mb-8">Create New Offer</h1>
      
      <div className="bg-canvas border border-hairline rounded-sm shadow-sm p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-ink-strong">Company Name</label>
              <input 
                type="text" 
                value={formData.company_name}
                onChange={e => setFormData({...formData, company_name: e.target.value})}
                placeholder="e.g. ABC Logistics"
                className="h-10 px-3 bg-canvas border border-hairline-strong rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-ink-strong">Person Name</label>
              <input 
                type="text" 
                value={formData.person_name}
                onChange={e => setFormData({...formData, person_name: e.target.value})}
                placeholder="e.g. Jane Doe"
                className="h-10 px-3 bg-canvas border border-hairline-strong rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-ink-strong">Role / Position</label>
              <input 
                type="text" 
                value={formData.person_role}
                onChange={e => setFormData({...formData, person_role: e.target.value})}
                placeholder="e.g. Founder"
                className="h-10 px-3 bg-canvas border border-hairline-strong rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-ink-strong">Offer Title</label>
            <input 
              required
              type="text" 
              value={formData.offer_title}
              onChange={e => setFormData({...formData, offer_title: e.target.value})}
              placeholder="e.g. Enterprise customer acquisition"
              className="h-10 px-3 bg-canvas border border-hairline-strong rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-ink-strong">Initial Stage</label>
              <select 
                value={formData.stage}
                onChange={e => setFormData({...formData, stage: e.target.value})}
                className="h-10 px-3 bg-canvas border border-hairline-strong rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="contacted">Contacted</option>
                <option value="responded">Responded</option>
                <option value="conversation">Conversation</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3 mt-8">
              <input 
                type="checkbox" 
                id="is_public"
                checked={formData.is_public}
                onChange={e => setFormData({...formData, is_public: e.target.checked})}
                className="h-4 w-4 rounded border-hairline-strong text-primary focus:ring-primary"
              />
              <label htmlFor="is_public" className="text-[13px] font-medium text-ink-strong">
                Make public on website
              </label>
            </div>
          </div>

          <div className="border-t border-hairline pt-6 mt-2 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="h-9 px-6 bg-ink-strong text-white rounded-md text-[13px] font-medium hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Offer"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
