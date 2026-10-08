# Supabase Integration — Setup & Assumptions

This app now talks **only** to your existing Supabase project. No other database,
mock data, or local persistence layer is used anywhere in the codebase.

## 1. What you still need to do

I could not connect to your Supabase project from here (no network access in
this environment), so two things need to happen on your side before booking
and lookup actually work:

1. **Add your publishable (anon) key.** Open `.env.local` in the project root
   and replace `REPLACE_WITH_YOUR_SUPABASE_PUBLISHABLE_ANON_KEY` with the real
   value from Supabase → Project Settings → API → "anon / public" key (or
   "publishable key" if your project uses the newer key naming). The project
   URL is already filled in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://jlfqodfdqkbunqfgffut.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<paste your key here>
   ```
   Add the same two variables in your Netlify site settings (Site
   configuration → Environment variables) for the deployed build.

2. **Verify the column names below against your actual tables.** I built the
   integration against a reasonable, standard schema inferred from your
   requirements doc and table names, but I have not seen your real schema.
   If any column name differs, everything reads from **one file**:
   `lib/booking-service.ts`. Update the field names there and nothing else
   needs to change.

## 2. Assumed schema

**customers**
| column | type | notes |
|---|---|---|
| id | uuid, pk | |
| full_name | text | |
| phone | text | looked up as the verification credential |

**bookings**
| column | type | notes |
|---|---|---|
| id | uuid, pk | |
| booking_id | text, unique, database-generated | human-readable booking reference |
| customer_id | uuid, fk → customers.id | |
| service_id | uuid, fk → services.id | |
| urgency | text | `emergency` \| `today` \| `flexible` |
| preferred_date | date, nullable | |
| preferred_time | text, nullable | |
| address | text | |
| additional_notes | text, nullable | |
| status | text | one of: `pending`, `confirmed`, `assigned`, `in_progress`, `completed`, `cancelled`, `rescheduled` |
| created_at | timestamptz | |

**booking_locations**
| column | type | notes |
|---|---|---|
| id | uuid, pk | |
| booking_id | uuid, fk → bookings.id | |
| formatted_address | text | |
| city | text, nullable | |

**booking_status_history**
| column | type | notes |
|---|---|---|
| id | uuid, pk | |
| booking_id | uuid, fk → bookings.id | |
| status | text | |
| note | text, nullable | |
| created_at | timestamptz | |

`services` is the source of truth for the UUID stored in `bookings.service_id`.
The UI keeps its presentation catalogue in `lib/services.ts`, while
`lib/booking-service.ts` resolves the selected UI service to an active Supabase
service record before inserting the booking.

## 3. Booking ID generation

Your doc says the Booking ID should be "database-generated." Since I can't
confirm whether your `bookings` table has a default/trigger that populates
`booking_id` automatically, the app generates it in the browser
(`lib/booking-service.ts` → `generateBookingReference()`) in the exact
`SP-YYYYMMDD-XXXXXX` format from your example, and inserts it explicitly. This
works whether or not a DB-side default exists (an explicit value simply takes
precedence). If you'd rather the database be the sole source of truth, add a
`DEFAULT`/trigger in Supabase and remove `booking_id: bookingId` from the
insert in `createBooking()`.

## 4. "Find My Booking" and Row Level Security

The lookup in `findBooking()` (`lib/booking-service.ts`) queries `bookings`
joined to `customers`, then cross-checks the phone number in application
code before returning anything. For this to work with the anon/publishable
key, your existing RLS policies need to allow `SELECT` on `bookings`,
`customers`, `booking_locations`, and `booking_status_history` for
anonymous/public requests (your doc states these policies already exist). If
lookups return "not found" even for a booking you know exists, check RLS
policies on these four tables first — that's the most likely cause.

Per your requirements, this app never creates, alters, or modifies your
Supabase schema or RLS policies — only the frontend connects to them.

## 5. What changed in the app

- `lib/supabase.ts` — the shared Supabase client (publishable key only).
- `lib/booking-service.ts` — all reads/writes to `customers`, `bookings`,
  `booking_locations`, `booking_status_history`.
- `lib/booking-status.ts` — shared status/urgency labels, colors, and the
  seven supported statuses.
- `components/sections/booking-section.tsx` — booking flow now writes to
  Supabase and adds an **Urgency** step, with **Location** split out from
  customer details, matching your requested flow: Service → Urgency →
  Customer Information → Location → Schedule → Review → Confirm.
- `components/sections/find-booking-section.tsx` + `app/find-booking/page.tsx`
  — new "Find My Booking" page with credential-based lookup and full status
  timeline.
- `lib/site-logo.ts`, `components/site-header.tsx`, `components/site-footer.tsx`
  — the Sohan Pipeline's logo (previously a Droplets icon badge) now renders
  your Supabase Storage image everywhere it appeared (desktop/mobile header,
  footer). Links to "Find My Booking" were added to the header and footer.
- No Bolt database, mock database, or local-persistence booking storage was
  found anywhere in the original project — there was nothing to remove.
  `localStorage` is used only for the theme toggle, which is untouched.
