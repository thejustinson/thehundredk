"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const offerId = resolvedParams.id;
  
  const [offer, setOffer] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventType, setEventType] = useState("Status Update");
  const [newStage, setNewStage] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [submittingEvent, setSubmittingEvent] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchOfferDetails() {
      const { data: offerData, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', offerId)
        .single();
        
      if (offerData) {
        setOffer(offerData);
        setNewStage(offerData.stage);
        setNewStatus(offerData.status);
      }

      const { data: eventsData } = await supabase
        .from('offer_events')
        .select('*')
        .eq('offer_id', offerId)
        .order('event_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (eventsData) {
        setEvents(eventsData);
      }
      
      setLoading(false);
    }
    
    fetchOfferDetails();
  }, [offerId]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingEvent(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Insert event
    const { data: newEvent } = await supabase.from('offer_events').insert({
      offer_id: offerId,
      event_type: eventType,
      old_stage: offer.stage,
      new_stage: newStage,
      notes: notes,
      created_by: user?.id,
      is_public: offer.is_public // inherit visibility for simplicity here
    }).select().single();

    // Update Offer
    const updates: any = {
      stage: newStage,
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    await supabase.from('offers').update(updates).eq('id', offerId);
    
    // Update local state
    if (newEvent) {
      setEvents([newEvent, ...events]);
    }
    setOffer({ ...offer, ...updates });
    setShowEventForm(false);
    setNotes("");
    setSubmittingEvent(false);
  };

  if (loading) return <div className="p-8">Loading offer...</div>;
  if (!offer) return <div className="p-8">Offer not found.</div>;

  return (
    <div className="p-8 max-w-[1000px] w-full mx-auto pb-32">
      <Link href="/dashboard" className="text-[13px] text-ink-subtle hover:text-ink-strong mb-6 inline-block">
        ← Back to Pipeline
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-medium text-ink-strong tracking-tight mb-2">
            {offer.offer_title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-ink-subtle">
            <span className="font-medium text-ink-strong">
              {[offer.person_name, offer.company_name].filter(Boolean).join(' • ') || 'Unknown Target'}
            </span>
            {offer.person_role && (
              <>
                <span>•</span>
                <span>{offer.person_role}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-sm text-xs font-medium uppercase tracking-wide
            ${offer.status.toLowerCase() === 'won' ? 'text-[#0E7A2F] bg-[#CAFACE]' : 
              (offer.status.toLowerCase() === 'lost' || offer.status.toLowerCase() === 'rejected') ? 'text-primary bg-primary/10' : 
              'text-ink-strong bg-surface-2'}`
          }>
            {offer.status}
          </span>
          <span className={`px-3 py-1 rounded-sm text-xs font-medium uppercase tracking-wider border border-hairline-strong ${offer.is_public ? 'text-ink-strong' : 'text-ink-subtle'}`}>
            {offer.is_public ? 'Public' : 'Private'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column - History */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-hairline">
            <h2 className="text-lg font-medium text-ink-strong">Timeline History</h2>
            <button 
              onClick={() => setShowEventForm(!showEventForm)}
              className="text-[13px] font-medium text-primary hover:opacity-80"
            >
              {showEventForm ? "Cancel" : "+ Add Event"}
            </button>
          </div>

          {showEventForm && (
            <div className="bg-surface-2 border border-hairline rounded-sm p-6 mb-8">
              <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-ink-strong uppercase tracking-wider">Update Stage</label>
                    <select 
                      value={newStage} onChange={e => setNewStage(e.target.value)}
                      className="h-9 px-3 bg-canvas border border-hairline-strong rounded-sm text-[13px] focus:border-primary outline-none"
                    >
                      <option value="contacted">Contacted</option>
                      <option value="responded">Responded</option>
                      <option value="conversation">Conversation</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-ink-strong uppercase tracking-wider">Update Status</label>
                    <select 
                      value={newStatus} onChange={e => setNewStatus(e.target.value)}
                      className="h-9 px-3 bg-canvas border border-hairline-strong rounded-sm text-[13px] focus:border-primary outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="won">Won</option>
                      <option value="rejected">Rejected</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-strong uppercase tracking-wider">Notes / Lesson</label>
                  <textarea 
                    value={notes} onChange={e => setNotes(e.target.value)}
                    className="min-h-[80px] p-3 bg-canvas border border-hairline-strong rounded-sm text-[13px] focus:border-primary outline-none resize-none"
                    placeholder="Log a rejection reason, lesson learned, or general note..."
                  />
                </div>
                <button 
                  type="submit" disabled={submittingEvent}
                  className="h-8 self-end px-4 bg-ink-strong text-white text-xs font-medium rounded-sm disabled:opacity-50"
                >
                  {submittingEvent ? "Saving..." : "Save Event"}
                </button>
              </form>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {events.length === 0 ? (
              <p className="text-sm text-ink-subtle">No events logged yet.</p>
            ) : (
              events.map(ev => (
                <div key={ev.id} className="flex gap-4 border-l border-hairline-strong ml-2 pl-6 relative">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-surface-2 border border-hairline-strong ring-4 ring-canvas" />
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[13px] font-medium text-ink-strong">{ev.event_type}</span>
                      <span className="text-xs text-ink-subtle">{new Date(ev.event_date || ev.created_at).toLocaleDateString()}</span>
                    </div>
                    {ev.old_stage && ev.new_stage && ev.old_stage !== ev.new_stage && (
                      <div className="text-xs text-ink-subtle mb-2">
                        Stage changed from <span className="font-medium text-ink">{ev.old_stage}</span> to <span className="font-medium text-ink">{ev.new_stage}</span>
                      </div>
                    )}
                    {ev.notes && (
                      <div className="mt-2 text-sm text-ink bg-surface-2 p-3 rounded-sm border border-hairline">
                        {ev.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Meta */}
        <div>
          <div className="bg-canvas border border-hairline rounded-sm p-6 flex flex-col gap-6 shadow-sm">
            <div>
              <span className="block text-xs font-medium text-ink-subtle uppercase tracking-wider mb-1">Current Stage</span>
              <span className="text-sm text-ink-strong capitalize font-medium">{offer.stage}</span>
            </div>
            
            <div className="border-t border-hairline pt-4">
              <span className="block text-xs font-medium text-ink-subtle uppercase tracking-wider mb-1">Created On</span>
              <span className="text-sm text-ink-strong">{new Date(offer.created_at).toLocaleDateString()}</span>
            </div>

            {offer.deal_value && (
              <div className="border-t border-hairline pt-4">
                <span className="block text-xs font-medium text-ink-subtle uppercase tracking-wider mb-1">Deal Value</span>
                <span className="text-sm text-ink-strong font-medium">${offer.deal_value} {offer.deal_currency}</span>
              </div>
            )}
            
            <div className="border-t border-hairline pt-4 flex flex-col gap-3">
              <button 
                onClick={async () => {
                  const newVisibility = !offer.is_public;
                  await supabase.from('offers').update({ is_public: newVisibility }).eq('id', offer.id);
                  // Also update events to match the offer's visibility for simplicity
                  await supabase.from('offer_events').update({ is_public: newVisibility }).eq('offer_id', offer.id);
                  setOffer({ ...offer, is_public: newVisibility });
                }}
                className={`text-[13px] font-medium px-4 py-2 rounded-sm border ${offer.is_public ? 'border-primary text-primary hover:bg-primary/5' : 'border-hairline-strong text-ink-strong hover:bg-surface-2'} transition-colors text-center w-full`}
              >
                {offer.is_public ? "Make Private" : "Make Public"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
