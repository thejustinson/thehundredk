# Project: The Hundred K

The Hundred K is a public sales journey and private sales CRM.

The goal is simple:

> Reach out to 100,000 people.
>
> Sell.
> Get rejected.
> Learn.
> Repeat.

The project publicly documents the journey while keeping sensitive prospect information private.

The system consists of:

**Web dashboard → Supabase → Public website**

and

**Telegram bot → Gemini → Supabase → Public website**

The Telegram bot and web dashboard are two interfaces for the same underlying sales system.

---

# 1. Core Product Principle

The Hundred K is NOT primarily a dashboard.

It is a **sales operating system and public record of a long-term experiment in sales mastery.**

The most important object in the system is an **Offer**.

An Offer represents a sales opportunity.

Example:

> Offer #1247
> Company: ABC Logistics
> Offer: Enterprise customer acquisition
> Stage: Proposal
> Created: October 5, 2026

The Offer progresses over time through events.

Example:

```text
Contacted
→ Replied
→ Conversation
→ Proposal
→ Negotiation
→ Won
```

or:

```text
Contacted
→ Replied
→ Conversation
→ Lost
```

Do NOT model the system as a flat list of disconnected sales activities.

An Offer is the persistent object.

Offer Events are its history.

---

# 2. Primary Goals

The system must allow Justin to:

1. Create Offers.
2. Update Offers.
3. Track Offer progress.
4. Record every meaningful interaction.
5. Record wins and losses.
6. Record rejection reasons.
7. Add notes and lessons.
8. View sales statistics.
9. Use Telegram as a low-friction input interface.
10. Use Gemini to convert natural language into structured records.
11. Use the web dashboard to manually create/edit records.
12. Decide what information is public.
13. Keep sensitive prospect information private.
14. Display public sales activity transparently.
15. Track progress toward 100,000 people reached.

---

# 3. Product Philosophy

Optimize for:

**Capture → Understand → Confirm → Store → Publish**

Do NOT optimize for:

**Open dashboard → fill a giant form → submit**

Logging sales activity must be extremely low friction.

Justin should be able to send Telegram messages such as:

> "Reached out to the founder of ABC today about handling outbound acquisition for them. He liked the idea and asked me to send a proposal tomorrow."

The system should understand this and propose a structured update.

---

# 4. Tech Stack

Use the existing project's stack and conventions.

Preferred technologies:

* Next.js
* TypeScript
* React
* Supabase
* PostgreSQL
* Telegram Bot API
* Google Gemini API
* Tailwind if already used by the project
* Existing UI/component system where available

Do not introduce another framework or database unless there is a compelling technical reason.

All JavaScript must be TypeScript.

---

# 5. Architecture

The system should follow this architecture:

```text
                  ┌──────────────────┐
                  │  Web Dashboard   │
                  └────────┬─────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Supabase   │
                    │ PostgreSQL  │
                    └──────▲──────┘
                           │
                  ┌────────┴─────────┐
                  │                  │
           ┌──────┴──────┐    ┌──────┴──────┐
           │ Telegram    │    │ Public Site │
           │ Bot         │    │ /           │
           └──────┬──────┘    └─────────────┘
                  │
                  ▼
             ┌─────────┐
             │ Gemini  │
             └─────────┘
```

Supabase is the source of truth.

The public website must read from Supabase.

The dashboard must read/write through secure server-side operations.

The Telegram bot must write through secure server-side operations.

Gemini must never be called directly from the browser.

---

# 6. Core Data Model

## Offers

Create an `offers` table.

Suggested fields:

```text
id
offer_number
created_at
updated_at

activity_date

person_name
company_name
person_role
industry

contact_email
contact_phone
contact_username

offer_title
offer_description

channel

stage
status

deal_value
deal_currency

next_action
next_action_date

rejection_reason

private_notes
public_notes

lesson

is_public

created_by
```

Use appropriate PostgreSQL types.

Do not blindly implement every field above if the existing architecture suggests a better normalized structure.

Sensitive information should be treated as private by default.

---

# 7. Offer Stages

Start with:

```text
contacted
responded
conversation
qualified
proposal
negotiation
won
lost
```

The system should allow stage progression without destroying historical information.

Do not hardcode stage-specific logic throughout the application.

Use a central stage definition/configuration.

---

# 8. Offer Events

Create an `offer_events` table.

Each event belongs to an Offer.

Suggested fields:

```text
id
offer_id
created_at

event_date

event_type

title
description

old_stage
new_stage

notes
lesson

is_public

created_by
```

Examples:

```text
Contacted
Responded
Conversation
Proposal sent
Follow-up
Meeting
Negotiation
Won
Lost
```

Every important Offer state change should create an event.

Never simply overwrite the previous state and lose the history.

---

# 9. Event History

Example:

```text
Offer #1247

Oct 5
Contacted

Oct 6
Responded

Oct 7
Conversation

Oct 9
Proposal sent

Oct 12
Negotiation

Oct 15
Won
```

The current stage is derived from the latest relevant state.

The event history remains permanently available.

This historical record is one of the most important features of the product.

---

# 10. People / Contacts

Do not unnecessarily duplicate person information across Offers.

If the same person/company can have multiple Offers, consider separate entities:

```text
contacts
companies
offers
offer_events
```

However, do not over-normalize the database prematurely.

The primary requirement is reliable sales tracking, not building a general-purpose CRM.

---

# 11. Public / Private Data

Privacy is a core requirement.

Every record must be private by default.

Never assume that because an Offer is public, every field inside it is public.

The system should support field-level visibility.

Possible fields:

```text
person_name
company_name
role
industry
offer
channel
stage
deal_value
notes
lesson
```

Each should eventually support:

```text
public
private
```

At minimum, implement record-level public/private visibility now and structure the database so field-level visibility can be added cleanly.

Never expose:

* private phone numbers
* private email addresses
* private usernames
* private messages
* addresses
* sensitive personal information

unless explicitly marked for public display.

---

# 12. Public Website

The public website should be available at:

```text
/
```

or:

```text
/sales
```

depending on the existing project architecture.

The public site should communicate the experiment.

Core message:

> 100,000 people.
>
> I'm trying to become one of the best salespeople of my generation.
>
> So I'm treating sales like a numbers game.
>
> Reach out.
> Sell.
> Get rejected.
> Learn.
> Repeat.

---

# 13. Public Statistics

Display:

```text
People reached
Offers
Active offers
Conversations
Pitches
Follow-ups
Rejections
Deals won
Revenue
```

Also calculate:

```text
Response rate
Conversation rate
Close rate
Average deal value
```

Do not hardcode these numbers.

Calculate them from Supabase.

Avoid downloading the entire database into the browser just to calculate statistics.

Prefer server-side/database aggregation.

---

# 14. 100,000 Counter

The main metric is:

```text
people reached / 100000
```

Display:

```text
1,247 / 100,000
```

and:

```text
1.247%
```

The progress indicator should update automatically when new records are added.

The system should support milestones:

```text
1,000
5,000
10,000
25,000
50,000
75,000
100,000
```

---

# 15. Definition of "Person Reached"

Be careful not to inflate this metric.

One person should not count as a new person every time Justin follows up.

A person represents a unique prospect.

If Justin contacts the same person five times:

```text
People reached: +1
Touches: +5
```

This distinction is important.

The database should therefore distinguish between:

**People**

and

**Touches / Offer Events**

---

# 16. Telegram Bot

Telegram is a primary input interface.

The bot should support natural language.

Example:

> "Reached out to 12 founders today. Three replied. One wants a call Friday, one said they aren't interested, and one asked me to send pricing."

Gemini should extract structured information.

The bot should identify whether this represents:

* one Offer
* multiple Offers
* Offer Events
* aggregate outreach

Do not blindly create duplicate Offers.

---

# 17. Gemini Integration

Gemini is an extraction and interpretation layer.

Its job is to transform unstructured human input into structured data.

Example:

Input:

> "Talked to a logistics founder today. I offered to handle outbound acquisition on commission. He liked the idea but wants to discuss it with his cofounder."

Output:

```json
{
  "action": "create_offer",
  "company": "...",
  "role": "founder",
  "offer": "outbound customer acquisition",
  "stage": "conversation",
  "status": "pending",
  "next_action": null,
  "deal_value": null,
  "lesson": null
}
```

Gemini must follow these rules:

* Never invent facts.
* Never invent names.
* Never invent prices.
* Never invent rejection reasons.
* Use `null` when information is unavailable.
* Separate facts from interpretations.
* Prefer asking for confirmation when uncertain.
* Preserve the user's original meaning.

---

# 18. Gemini Confirmation

Never silently commit uncertain AI extraction.

For ambiguous or important changes, show:

```text
I understood:

Company: ABC Logistics
Role: Founder
Offer: Outbound customer acquisition
Stage: Conversation
Next action: Send proposal
Date: October 6, 2026

Create this Offer?

[Confirm]
[Edit]
[Cancel]
```

The confirmation should happen in Telegram.

The dashboard should also allow editing after creation.

---

# 19. Telegram Commands

Support:

```text
/start
/stats
/recent
/offers
/sale
/rejection
/reach
```

However, commands are secondary.

Natural language should be the primary interface.

Examples:

```text
"Closed the ABC deal for ₦200k."

"Rejected by a founder because they already have an agency."

"Followed up with the logistics company."

"Reached out to 20 people today."
```

The bot should interpret these appropriately.

---

# 20. Updating Existing Offers

The bot should recognize references to existing Offers.

Example:

> "ABC replied and wants the proposal."

The system should search for likely matching Offers.

If there is one strong match:

```text
I think you mean:

Offer #1247 — ABC Logistics

Update:
Stage → Proposal

[Confirm]
[Choose another]
[Cancel]
```

If there are multiple plausible matches, ask the user to select one.

Never silently update the wrong Offer.

---

# 21. Web Dashboard

Create a private dashboard.

The dashboard should allow:

* Create Offer
* Edit Offer
* Delete/archive Offer
* Change stage
* Add Event
* Add note
* Add lesson
* Change visibility
* View timeline
* Search Offers
* Filter Offers
* View statistics

The dashboard should make it easy to manage the entire sales pipeline.

---

# 22. Offer Detail Page

Each Offer should have a dedicated page.

Example:

```text
Offer #1247

ABC Logistics
Founder

Outbound customer acquisition

CURRENT STAGE
Proposal

CREATED
October 5, 2026

NEXT ACTION
Follow up

TIMELINE

Oct 5
Contacted

Oct 6
Responded

Oct 7
Conversation

Oct 9
Proposal sent
```

Provide an edit interface.

---

# 23. Public Offer Page

If an Offer is public, allow it to be viewed publicly.

Example:

```text
thehundredk.com/offers/1247
```

Only display fields explicitly allowed to be public.

The private dashboard and public page must use different authorization paths.

Never hide private information only with CSS or frontend filtering.

Private data must not be sent to unauthenticated clients.

---

# 24. Rejection Tracking

A rejection is a useful event, not a failure state to hide.

Track:

```text
price
timing
no_need
existing_solution
no_response
not_interested
trust
unclear
other
```

Allow free-text explanation.

Every rejection can optionally have a lesson.

Example:

```text
Rejected

Reason:
Already has an agency.

Lesson:
I need to establish why changing their current system is worth the switching cost.
```

---

# 25. Lessons

Lessons belong to Offers or Events.

They should be written in Justin's voice.

Do not generate motivational LinkedIn-style filler.

Bad:

> "Every no gets you closer to a yes!"

Good:

> "I pitched before establishing the cost of their current acquisition process."

The goal is to create an honest record of learning.

---

# 26. Design

The Hundred K should NOT look like a generic SaaS CRM.

Visual direction:

* Minimal
* Editorial
* Personal
* High contrast
* Black
* White
* Red as an accent
* Borders
* Strong typography
* Mobile-first
* Fast
* Sparse
* Lots of whitespace

Avoid:

* Excessive cards
* Excessive shadows
* Gradient-heavy SaaS UI
* Fake metrics
* Gratuitous animations
* Generic AI aesthetics
* Corporate stock imagery

The project should feel like a **public experiment / journal / scoreboard**.

---

# 27. Public Transparency

The public website should show enough detail to make the experiment credible.

Possible public sections:

```text
THE HUNDRED K

100,000 people
1,247 reached

CURRENT STATS

ACTIVE OFFERS

RECENT ACTIVITY

WINS

REJECTIONS

LESSONS

SALES TIMELINE
```

Do not expose private data.

---

# 28. Authentication

The private dashboard must require authentication.

The Telegram bot must only accept commands from authorized Telegram user IDs.

Never use Telegram display names as the authentication mechanism.

Store authorized Telegram IDs securely.

All secrets must be server-side.

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
TELEGRAM_BOT_TOKEN
```

to the browser.

---

# 29. Supabase Security

Use Row Level Security.

Public users should only be able to read explicitly public data.

Private users should be able to manage their own data.

Service-role access must only exist in trusted server environments.

Never solve security by hiding data in the frontend.

If a field is private, do not send it to the public client.

---

# 30. Auditability

Important changes should be traceable.

When an Offer changes:

```text
old stage
new stage
timestamp
source
```

should be recorded.

The source may be:

```text
telegram
dashboard
system
gemini
```

Gemini should never be considered the final authority.

The user's confirmation is the authority.

---

# 31. Source Tracking

Every record/event should know where it came from.

Examples:

```text
telegram
dashboard
manual
gemini
```

For Telegram-created records, store the relevant Telegram message ID if useful.

This allows future debugging and auditability.

---

# 32. Dates and Timezones

Dates are important because the entire project is a chronological public experiment.

Store timestamps in UTC.

Display dates in the appropriate user timezone.

Keep:

```text
created_at
activity_date
updated_at
```

separate.

Do not assume the date an entry was created is always the date the sales activity happened.

---

# 33. Search and Filtering

The dashboard should support:

Search by:

* person
* company
* offer
* notes

Filter by:

* stage
* status
* channel
* industry
* date
* public/private
* won/lost
* active/inactive

Keep filtering fast.

---

# 34. Don't Overbuild

Do NOT initially build:

* multi-user CRM
* team accounts
* billing
* subscriptions
* complex permissions
* marketplace
* social network
* public user registration
* AI chatbot for visitors
* elaborate forecasting

This is initially Justin's personal sales operating system.

Build the foundation well.

---

# 35. Future Possibilities

Structure the system so it can eventually support:

* Multiple sales experiments
* Multiple users
* Public profiles
* Public sales journeys
* Anonymous benchmarking
* Sales analytics
* Conversion analysis
* Channel performance
* Offer performance
* AI sales analysis
* Weekly/monthly reports

But do not build these prematurely.

---

# 36. Quality Bar

The finished application should feel like something Justin would actually use every day for years.

Prioritize:

1. Data integrity
2. Privacy
3. Low-friction capture
4. Accurate history
5. Excellent UX
6. Fast performance
7. Clean architecture
8. Public transparency

Do not sacrifice correctness for visual polish.

---

# 37. Development Rules

Before implementing anything:

1. Inspect the existing repository.
2. Understand the current architecture.
3. Reuse existing components.
4. Reuse existing authentication if present.
5. Reuse existing Supabase configuration if present.
6. Do not rewrite unrelated code.
7. Keep TypeScript strict.
8. Keep secrets server-side.
9. Add migrations for database changes.
10. Test critical database operations.
11. Test public/private visibility.
12. Test Telegram extraction and confirmation.
13. Test Offer stage transitions.
14. Test duplicate prevention.

---

# 38. Definition of Done

The system is successful when Justin can:

### From Telegram:

Send:

> "Reached out to the founder of ABC today about helping them acquire enterprise customers. He was interested and asked for a proposal tomorrow."

And receive:

```text
NEW OFFER DETECTED

ABC
Founder

Offer:
Enterprise customer acquisition

Stage:
Conversation

Next action:
Send proposal tomorrow

[Create Offer]
[Edit]
[Cancel]
```

After confirmation, the Offer appears in Supabase.

### From the dashboard:

Justin can:

* see the Offer
* edit it
* change its stage
* add events
* add notes
* control visibility

### From the public website:

Visitors can see the public version of the Offer and its public timeline.

Private information remains completely inaccessible.

### Most importantly:

Every sales attempt contributes to a growing, accurate, chronological record of the journey from:

**0 → 100,000 people.**

That record is the heart of The Hundred K.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
