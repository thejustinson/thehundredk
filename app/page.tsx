"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "../lib/supabase";

type TimelineEvent = {
  step: string;
  date: string;
};

type Activity = {
  id: string;
  date: string;
  timestamp: number;
  title: string;
  status: string;
  companyRole: string;
  reason?: string;
  result?: string;
  lesson?: string;
  timeline: TimelineEvent[];
};

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    
    const duration = 1500; // 1.5s
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo for dramatic slowdown at the end
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(Math.floor(easeProgress * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
}

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ reached: 0, responseRate: 0, dealsWon: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("Newest first");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      // Fetch all offers securely (masked if private)
      const res = await fetch("/api/timeline");
      
      if (!res.ok) {
        console.error("Error fetching data:", await res.text());
        setLoading(false);
        return;
      }
      
      const offersData = await res.json();

      if (offersData) {
        const formattedActivities: Activity[] = offersData.map((offer: any) => {
          // Format target string
          const targetStr = [offer.person_name, offer.company_name].filter(Boolean).join(" • ");
          const roleStr = [targetStr, offer.person_role].filter(Boolean).join(" • ");
          
          // Format the internal timeline events
          const events = offer.offer_events || [];
          // Sort events by date oldest first to show progression
          events.sort((a: any, b: any) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
          
          const timeline: TimelineEvent[] = events.map((ev: any) => ({
            step: ev.event_type,
            date: new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }));

          // Ensure the final state is always represented if there are no events yet
          if (timeline.length === 0) {
            timeline.push({
              step: "Contacted",
              date: new Date(offer.activity_date || offer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
          }

          let resultText = undefined;
          if (offer.status.toLowerCase() === 'won' && offer.deal_value) {
            resultText = `Closed for $${offer.deal_value}`;
          }

          return {
            id: offer.id,
            date: new Date(offer.activity_date || offer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            timestamp: new Date(offer.activity_date || offer.created_at).getTime(),
            title: offer.offer_title,
            status: offer.status.charAt(0).toUpperCase() + offer.status.slice(1),
            companyRole: roleStr,
            reason: offer.rejection_reason,
            result: resultText,
            lesson: offer.lesson,
            timeline,
          };
        });

        setActivities(formattedActivities);

        // Open the first item by default if it exists
        if (formattedActivities.length > 0) {
          // Sort briefly just to find the newest to open
          const newestId = [...formattedActivities].sort((a, b) => b.timestamp - a.timestamp)[0].id;
          setOpenItems({ [newestId]: true });
        }

        // Calculate Stats (Mocking total reached for now, you might track this separately)
        const wonOffers = formattedActivities.filter(a => a.status.toLowerCase() === 'won');
        const revenue = offersData.reduce((sum: number, current: any) => sum + (Number(current.deal_value) || 0), 0);
        
        // For the experiment, "reached" should probably be a total count of all offers (including private)
        // Let's do a quick count of all offers for the 'reached' stat
        const { count: totalOffers } = await supabase
          .from("offers")
          .select("*", { count: "exact", head: true });

        setStats({
          reached: totalOffers || 0,
          responseRate: totalOffers && totalOffers > 0 ? Number(((formattedActivities.length / totalOffers) * 100).toFixed(1)) : 0, // simplified calc
          dealsWon: wonOffers.length,
          revenue: revenue
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const toggleItem = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sortedActivities = useMemo(() => {
    let filtered = [...activities];
    
    if (sortBy === "Wins only") {
      filtered = filtered.filter(a => a.status.toLowerCase() === "won");
    } else if (sortBy === "Rejections only") {
      filtered = filtered.filter(a => a.status.toLowerCase() === "rejected");
    }

    if (sortBy === "Oldest first") {
      filtered.sort((a, b) => a.timestamp - b.timestamp);
    } else {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    return filtered;
  }, [sortBy, activities]);

  const percentageComplete = (stats.reached / 100000) * 100;
  // Let's animate the progress bar width over 1.5s via simple CSS transition
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-start px-6 py-6 border-b border-hairline max-w-[1280px] w-full mx-auto">
        <div className="font-sans font-medium text-ink-strong tracking-tight">
          THE HUNDRED K
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-40 flex flex-col items-center justify-center max-w-[1280px] w-full mx-auto relative cursor-default">
          <div className="flex flex-col items-center w-full max-w-3xl">
            <div className="text-[120px] sm:text-[160px] md:text-[200px] lg:text-[260px] font-medium tabular-nums tracking-tighter text-ink-strong leading-none select-none">
              <AnimatedNumber value={stats.reached} />
            </div>
            
            <div className="w-full mt-12 flex flex-col gap-4">
              <div className="flex justify-between items-end px-2">
                <span className="text-xl md:text-2xl text-ink-subtle font-medium tabular-nums tracking-tight">
                  / 100,000
                </span>
                <span className="text-sm font-medium text-ink-strong tracking-wide">
                  {percentageComplete.toFixed(3)}%
                </span>
              </div>
              
              <div className="w-full h-2 bg-surface-2 rounded-full border border-hairline overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-[1500ms] ease-[cubic-bezier(0.19,1,0.22,1)]" 
                  style={{ width: mounted ? `${percentageComplete}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          <div className="max-w-md text-center mt-16 space-y-4 text-ink-subtle">
            <p className="text-sm md:text-base leading-relaxed">
              On way to my first 100k Offers. Thanks for stopping by.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm font-medium">
              <a href="https://x.com/thejustinson" target="_blank" rel="noopener noreferrer" className="text-ink-subtle hover:text-ink-strong transition-colors" aria-label="X (Twitter)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.instagram.com/thejustinson" target="_blank" rel="noopener noreferrer" className="text-ink-subtle hover:text-ink-strong transition-colors" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/in/thejustinson" target="_blank" rel="noopener noreferrer" className="text-ink-subtle hover:text-ink-strong transition-colors" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <div className="w-px h-4 bg-hairline-strong"></div>
              <a href="#recent-activities" className="text-ink-subtle hover:text-ink-strong transition-colors underline underline-offset-4 decoration-hairline-strong hover:decoration-ink-strong">
                Timeline
              </a>
            </div>
          </div>
        </section>

        {/* Bento Stats */}
        <section className="px-6 pb-24 max-w-[1280px] w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline rounded-sm overflow-hidden border border-hairline shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06),0_2px_4px_0_rgba(0,0,0,0.04)]">
            <div className="bg-canvas p-6 md:p-8 flex flex-col gap-2">
              <span className="text-sm font-medium text-ink-subtle uppercase tracking-wide">Response Rate</span>
              <span className="text-3xl font-medium text-ink-strong tabular-nums">{stats.responseRate}%</span>
            </div>
            <div className="bg-canvas p-6 md:p-8 flex flex-col gap-2">
              <span className="text-sm font-medium text-ink-subtle uppercase tracking-wide">Deals Won</span>
              <span className="text-3xl font-medium text-ink-strong tabular-nums">{stats.dealsWon}</span>
            </div>
            <div className="bg-canvas p-6 md:p-8 flex flex-col gap-2">
              <span className="text-sm font-medium text-ink-subtle uppercase tracking-wide">Revenue</span>
              <span className="text-3xl font-medium text-ink-strong tabular-nums">${stats.revenue.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Recent Timeline */}
        <section id="recent-activities" className="px-6 pb-32 max-w-[1280px] w-full mx-auto scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 border-b border-hairline pb-4">
            <h2 className="text-2xl font-medium tracking-tight text-ink-strong">
              Recent Activity
            </h2>
            <div className="flex items-center gap-2 text-sm text-ink-subtle">
              <span className="font-medium">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-canvas border border-hairline rounded-sm px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary text-ink shadow-sm"
              >
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>Wins only</option>
                <option>Rejections only</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col gap-8 border-l border-hairline-strong ml-2 pl-6 md:pl-8">
            {loading && (
              <div className="text-ink-subtle text-sm italic py-4">Loading activities...</div>
            )}
            {!loading && sortedActivities.length === 0 && (
              <div className="text-ink-subtle text-sm italic py-4">No activities match this filter yet. Start logging!</div>
            )}
            
            {sortedActivities.map((activity) => {
              const isWon = activity.status.toLowerCase() === "won";
              const isOpen = openItems[activity.id] || false;
              
              return (
                <details 
                  key={activity.id}
                  className="relative group cursor-pointer marker:content-['']" 
                  open={isOpen}
                  onClick={(e) => toggleItem(activity.id, e)}
                >
                  <summary className="list-none outline-none block [&::-webkit-details-marker]:hidden">
                    <div 
                      className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-3 h-3 rounded-full ring-[6px] ring-canvas ${!isWon ? 'bg-primary' : ''}`}
                      style={isWon ? { backgroundColor: '#15B042' } : {}}
                    ></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 group-hover:opacity-80 transition-opacity w-full">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1">
                        <span className="text-sm font-medium text-ink-subtle tabular-nums shrink-0">{activity.date}</span>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-medium text-ink-strong text-base">{activity.title}</span>
                          <span className="text-ink-subtle hidden sm:inline-block text-sm">—</span>
                          <span 
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-sm uppercase tracking-wide ${!isWon ? 'text-primary bg-primary/10' : ''}`}
                            style={isWon ? { color: '#0E7A2F', backgroundColor: '#CAFACE' } : {}}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium text-ink-subtle uppercase tracking-wider shrink-0 mt-2 md:mt-0 ${isOpen ? 'hidden' : 'inline-block'}`}>Expand</span>
                      <span className={`text-xs font-medium text-ink-subtle uppercase tracking-wider shrink-0 mt-2 md:mt-0 ${isOpen ? 'inline-block' : 'hidden'}`}>Collapse</span>
                    </div>
                  </summary>
                  
                  {isOpen && (
                    <div className="text-ink text-sm w-full mt-5 pb-4 cursor-default" onClick={e => e.stopPropagation()}>
                      <div className="bg-surface p-5 md:p-6 border border-hairline rounded-sm shadow-sm flex flex-col gap-6 w-full">
                        
                        {/* Internal Offer Timeline */}
                        <div>
                          <span className="text-ink-subtle block mb-3 font-medium text-xs uppercase tracking-wider">Offer Progression</span>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm">
                            {activity.timeline.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="flex flex-col">
                                  <span 
                                    className={`font-medium ${idx === activity.timeline.length - 1 ? (!isWon ? 'text-primary' : '') : 'text-ink-strong'}`} 
                                    style={idx === activity.timeline.length - 1 && isWon ? { color: '#0E7A2F' } : {}}
                                  >
                                    {item.step}
                                  </span>
                                  <span className="text-[11px] text-ink-subtle uppercase tracking-wider">{item.date}</span>
                                </div>
                                {idx < activity.timeline.length - 1 && (
                                  <span className="text-hairline-strong font-bold text-lg leading-none shrink-0">→</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {activity.companyRole && (
                          <div className="border-t border-hairline pt-4">
                            <span className="text-ink-subtle block mb-1">Company / Role:</span>
                            <span className="text-ink-strong font-medium text-base">{activity.companyRole}</span>
                          </div>
                        )}

                        {activity.reason && (
                          <div className="border-t border-hairline pt-4">
                            <span className="text-ink-subtle block mb-1">Reason for Rejection:</span>
                            <span className="text-ink-strong text-base">{activity.reason}</span>
                          </div>
                        )}
                        
                        {activity.result && (
                          <div className="border-t border-hairline pt-4">
                            <span className="font-medium block mb-1" style={{ color: '#0E7A2F' }}>Result:</span>
                            <span className="text-ink-strong text-base">{activity.result}</span>
                          </div>
                        )}

                        {activity.lesson && (
                          <div className="border-t border-hairline pt-4">
                            <span className="text-primary font-medium block mb-1">Lesson learned:</span>
                            <span className="text-base">{activity.lesson}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </details>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
