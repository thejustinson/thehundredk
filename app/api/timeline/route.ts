import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: offersData, error } = await supabaseAdmin
      .from("offers")
      .select(`
        id,
        activity_date,
        created_at,
        offer_title,
        status,
        company_name,
        person_name,
        person_role,
        rejection_reason,
        deal_value,
        lesson,
        is_public,
        offer_events (
          event_type,
          event_date,
          created_at
        )
      `)
      .order('activity_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mask private data securely on the server
    const safeData = offersData.map(offer => {
      
      // Clean up internal system logs for public viewing
      const sanitizedEvents = (offer.offer_events || []).map((ev: any) => ({
        ...ev,
        event_type: ev.event_type === "Created via Telegram" ? "Offer Created" : ev.event_type
      }));

      if (!offer.is_public) {
        return {
          ...offer,
          company_name: "Undisclosed Company",
          person_name: null, // Wipe the person's name
          offer_events: sanitizedEvents
          // We can keep the offer title, stage, status, and role (e.g. "Founder at Undisclosed Company")
        };
      }
      return {
        ...offer,
        offer_events: sanitizedEvents
      };
    });

    return NextResponse.json(safeData);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
