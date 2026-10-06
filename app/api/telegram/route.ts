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
  "lesson": "..."
}

2. Update existing offer / Log Event:
{
  "action": "update_offer",
  "company_search_term": "...", // The company or person they are referring to
  "new_stage": "...", 
  "new_status": "...",
  "deal_value": number|null,
  "rejection_reason": "...",
  "notes": "...",
  "lesson": "..."
}

Just return the JSON. No markdown ticks, no conversational text.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ── Handle Button Clicks (Callback Queries) ──
    if (body.callback_query) {
      const cb = body.callback_query;
      const chatId = cb.message.chat.id.toString();
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
            created_by: chatId,
            is_public: false // Requires manual dashboard flip to go public
          }).select().single();

          if (newOffer) {
            await supabaseAdmin.from('offer_events').insert({
              offer_id: newOffer.id,
              event_type: "Offer Created",
              new_stage: newOffer.stage,
              lesson: payload.lesson,
              created_by: chatId
            });
            await sendMessage(chatId, "✅ Offer created successfully!");
          }
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

    const chatId = message.chat.id.toString();
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

    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser Input: ${text}`);
    const responseText = result.response.text().trim().replace(/```json/g, "").replace(/```/g, "");
    
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (e) {
      await sendMessage(chatId, "I couldn't perfectly understand that. Could you try rephrasing?");
      return NextResponse.json({ ok: true });
    }

    // Store intention in DB to generate a UUID for the inline keyboard (callback_data is max 64 bytes)
    const { data: pending, error: dbError } = await supabaseAdmin.from('pending_telegram_updates').insert({
      chat_id: chatId,
      payload: parsed
    }).select('id').single();

    if (dbError || !pending) {
      console.error("Supabase Error inserting pending update:", dbError);
      await sendMessage(chatId, "⚠️ Failed to prepare confirmation. Database error. (Did you run telegram-schema.sql?)");
      return NextResponse.json({ ok: true });
    }

    if (parsed.action === "create_offer") {
      const textResponse = `<b>Create this Offer?</b>\n\nCompany: ${parsed.company_name || 'N/A'}\nPerson: ${parsed.person_name || 'N/A'}\nOffer: ${parsed.offer_title || 'Unknown'}\nStage: ${parsed.stage || 'contacted'}\nStatus: ${parsed.status || 'pending'}`;
      
      const keyboard = {
        inline_keyboard: [
          [
            { text: "✅ Confirm", callback_data: `confirm_${pending.id}` },
            { text: "❌ Cancel", callback_data: `cancel_${pending.id}` }
          ]
        ]
      };

      await sendMessage(chatId, textResponse, keyboard);
    } else if (parsed.action === "update_offer") {
      // In a robust implementation, we would fuzzy search the DB for `parsed.company_search_term` 
      // and ask the user to select which offer to update.
      await sendMessage(chatId, `<i>(Update logic detected for: ${parsed.company_search_term}, but not fully implemented in this prototype step yet. Cancelled.)</i>`);
    } else {
      await sendMessage(chatId, "<i>I understood your message, but it didn't look like a command to log or update a sale. Try saying 'I just pitched Acme Corp...'</i>");
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return NextResponse.json({ ok: true });
  }
}
