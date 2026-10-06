import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase-admin";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const AUTHORIZED_USER = process.env.TELEGRAM_AUTHORIZED_USER_ID!;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

async function sendMessage(chatId: string | number, text: string, replyMarkup?: any) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      reply_markup: replyMarkup,
      parse_mode: "HTML"
    })
  });
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text
    })
  });
}

const SYSTEM_PROMPT = `You are a strict data extraction AI for a sales CRM ("The Hundred K").
Your job is to read natural language sales updates and output a STRICT JSON payload.
Do NOT invent facts, names, or prices. Use null when missing.
Today's date is: ${new Date().toISOString().split('T')[0]}.
Always format the response as valid JSON matching one of these structures:

1. Create a new offer:
{
  "action": "create_offer",
  "company_name": "...", 
  "person_name": "...",
  "person_role": "...",
  "offer_title": "...",
  "stage": "contacted", // contacted, responded, conversation, proposal, negotiation
  "status": "pending", // pending, won, rejected, lost
  "deal_value": number|null,
  "lesson": "...",
  "private_notes": "...",
  "activity_date": "YYYY-MM-DD" // Extract the date they specify. If not specified, use today's date.
}

2. Update existing offer / Log Event:
{
  "action": "update_offer",
  "company_search_term": "...", // The company or person they are referring to
  "new_stage": "...", 
  "new_status": "...",
  "deal_value": number|null,
  "rejection_reason": "...",
  "private_notes": "...",
  "lesson": "...",
  "activity_date": "YYYY-MM-DD"
}

Just return the JSON. No markdown ticks, no conversational text.`;

export async function POST(req: Request) {
  let chatId: string | undefined;
  
  try {
    const body = await req.json();
    
    // ── Handle Button Clicks (Callback Queries) ──
    if (body.callback_query) {
      const cb = body.callback_query;
      chatId = cb.message.chat.id.toString();
      const data = cb.data; // e.g. "confirm_xyz" or "cancel_xyz"

      if (chatId !== AUTHORIZED_USER) return NextResponse.json({ ok: true });

      const action = data.split('_')[0]; // "confirm" or "cancel"
      const pendingId = data.split('_')[1]; // UUID

      if (action === "cancel") {
        await supabaseAdmin.from('pending_telegram_updates').delete().eq('id', pendingId);
        await sendMessage(chatId, "❌ Action cancelled.");
        await answerCallbackQuery(cb.id);
        return NextResponse.json({ ok: true });
      }

      if (action === "confirm") {
        const { data: pending } = await supabaseAdmin.from('pending_telegram_updates').select('payload').eq('id', pendingId).single();
        if (!pending) {
          await sendMessage(chatId, "⚠️ This action has expired or already been processed.");
          await answerCallbackQuery(cb.id);
          return NextResponse.json({ ok: true });
        }

        const payload = pending.payload;
        const dateToLog = payload.activity_date || new Date().toISOString().split('T')[0];

        if (payload.action === "create_offer") {
          const { data: newOffer, error: err } = await supabaseAdmin.from('offers').insert({
            company_name: payload.company_name,
            person_name: payload.person_name,
            person_role: payload.person_role,
            offer_title: payload.offer_title || 'Unknown Offer',
            stage: payload.stage || 'contacted',
            status: payload.status || 'pending',
            deal_value: payload.deal_value,
            lesson: payload.lesson,
            private_notes: payload.private_notes,
            activity_date: dateToLog,
            created_by: chatId,
            is_public: false // Requires manual dashboard flip to go public
          }).select().single();

          if (newOffer) {
            await supabaseAdmin.from('offer_events').insert({
              offer_id: newOffer.id,
              event_type: "Offer Created",
              event_date: dateToLog,
              new_stage: newOffer.stage,
              lesson: payload.lesson,
              notes: payload.private_notes,
              created_by: chatId
            });
            await sendMessage(chatId, "✅ Offer created successfully!");
          }
        } else if (payload.action === "update_offer") {
          const targetOfferId = payload.target_offer_id;
          
          // Construct updates dynamically (only if provided)
          const updates: any = { updated_at: new Date().toISOString() };
          if (payload.new_stage) updates.stage = payload.new_stage;
          if (payload.new_status) updates.status = payload.new_status;
          if (payload.deal_value) updates.deal_value = payload.deal_value;
          if (payload.rejection_reason) updates.rejection_reason = payload.rejection_reason;
          // Append private notes if they exist
          if (payload.private_notes) {
            // First fetch the existing offer to append notes safely, or just overwrite it? 
            // In a real app we might append, but for simplicity let's overwrite or rely on the event history.
            updates.private_notes = payload.private_notes; 
          }
          if (payload.lesson) updates.lesson = payload.lesson;
          
          await supabaseAdmin.from('offers').update(updates).eq('id', targetOfferId);
          
          // Log the event
          await supabaseAdmin.from('offer_events').insert({
            offer_id: targetOfferId,
            event_type: payload.new_stage ? `Moved to ${payload.new_stage}` : "Note Added",
            event_date: dateToLog,
            new_stage: payload.new_stage,
            lesson: payload.lesson,
            notes: payload.private_notes || payload.rejection_reason,
            created_by: chatId
          });
          
          await sendMessage(chatId, "✅ Offer updated successfully!");
        }

        // Clean up
        await supabaseAdmin.from('pending_telegram_updates').delete().eq('id', pendingId);
        await answerCallbackQuery(cb.id);
        return NextResponse.json({ ok: true });
      }
    }

    // ── Handle Regular Messages ──
    const message = body.message;
    if (!message || !message.text) return NextResponse.json({ ok: true });

    chatId = message.chat.id.toString();
    if (chatId !== AUTHORIZED_USER) {
      console.warn(`Unauthorized access attempt from ${chatId}`);
      return NextResponse.json({ ok: true });
    }

    const text = message.text;

    // Commands
    if (text === "/start") {
      await sendMessage(chatId, "Welcome to The Hundred K operating system. Send me natural language updates about your sales efforts.");
      return NextResponse.json({ ok: true });
    }
    
    if (text === "/stats") {
      const { count: total } = await supabaseAdmin.from('offers').select('*', { count: 'exact', head: true });
      await sendMessage(chatId, `<b>Current Stats:</b>\nPeople Reached: ${total} / 100,000`);
      return NextResponse.json({ ok: true });
    }

    // ── Process via Gemini ──
    await sendMessage(chatId, "<i>Thinking...</i>");

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser Input: ${text}`);
    const responseText = result.response.text().trim().replace(/```json/g, "").replace(/```/g, "");
    
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (e) {
      await sendMessage(chatId, "I couldn't perfectly understand that. Could you try rephrasing?");
      return NextResponse.json({ ok: true });
    }

    if (parsed.action === "create_offer") {
      const { data: pending } = await supabaseAdmin.from('pending_telegram_updates').insert({
        chat_id: chatId,
        payload: parsed
      }).select('id').single();

      const textResponse = `<b>Create this Offer?</b>\n\nCompany: ${parsed.company_name || 'N/A'}\nPerson: ${parsed.person_name || 'N/A'}\nOffer: ${parsed.offer_title || 'Unknown'}\nStage: ${parsed.stage || 'contacted'}\nDate: ${parsed.activity_date || 'Today'}\nNotes: ${parsed.private_notes || 'None'}`;
      
      const keyboard = {
        inline_keyboard: [
          [
            { text: "✅ Confirm", callback_data: `confirm_${pending?.id}` },
            { text: "❌ Cancel", callback_data: `cancel_${pending?.id}` }
          ]
        ]
      };

      await sendMessage(chatId, textResponse, keyboard);
    } else if (parsed.action === "update_offer") {
      // Fuzzy search the DB for `parsed.company_search_term`
      const { data: matches } = await supabaseAdmin
        .from('offers')
        .select('id, company_name, person_name, offer_title, stage')
        .or(`company_name.ilike.%${parsed.company_search_term}%,person_name.ilike.%${parsed.company_search_term}%`)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (!matches || matches.length === 0) {
        await sendMessage(chatId, `⚠️ I couldn't find any existing offers matching "<b>${parsed.company_search_term}</b>".\n\nTry sending the exact company name, or log it as a new offer instead.`);
        return NextResponse.json({ ok: true });
      }

      const targetOffer = matches[0];
      parsed.target_offer_id = targetOffer.id;

      const { data: pending } = await supabaseAdmin.from('pending_telegram_updates').insert({
        chat_id: chatId,
        payload: parsed
      }).select('id').single();

      const textResponse = `<b>Update Offer: ${targetOffer.company_name || targetOffer.person_name}</b>\n\nOffer: ${targetOffer.offer_title}\nCurrent Stage: ${targetOffer.stage}\n\n-> New Stage: ${parsed.new_stage || '(no change)'}\n-> Notes: ${parsed.private_notes || '(no notes)'}\n-> Date: ${parsed.activity_date || 'Today'}`;
      
      const keyboard = {
        inline_keyboard: [
          [
            { text: "✅ Confirm Update", callback_data: `confirm_${pending?.id}` },
            { text: "❌ Cancel", callback_data: `cancel_${pending?.id}` }
          ]
        ]
      };

      await sendMessage(chatId, textResponse, keyboard);
    } else {
      await sendMessage(chatId, "<i>I understood your message, but it didn't look like a command to log or update a sale. Try saying 'I just pitched Acme Corp...'</i>");
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Telegram Webhook Error:", error);
    // Explicitly notify the user if Gemini failed instead of hanging silently
    if (chatId) {
      if (error.message?.includes("503")) {
        await sendMessage(chatId, "⚠️ Google's AI servers are currently experiencing high demand. Please try logging this again in a minute.");
      } else {
        await sendMessage(chatId, "⚠️ An unexpected AI error occurred while processing your message.");
      }
    }
    return NextResponse.json({ ok: true });
  }
}
