# HirePrep — Project Analysis

---

## 1. Project Purpose

**HirePrep** is an AI-powered mock interview preparation platform built with Next.js. It allows users to sign up, log in, and practice job interviews through a conversational AI agent (via Vapi AI). The system is designed to simulate real interview sessions and eventually provide scored, categorized feedback.

---

## 2. Core Functionalities Implemented

| Feature | Status | Notes |
|---|---|---|
| User Sign-Up | ✅ Implemented | Email/password via Firebase Auth + Firestore profile |
| User Sign-In | ✅ Implemented | Firebase Auth → server-side session cookie |
| Session Management | ✅ Implemented | HttpOnly cookie with 7-day expiry via Firebase Admin |
| Interview Dashboard | ✅ Implemented | Lists interviews (currently using dummy data) |
| Interview Card Display | ✅ Implemented | Shows role, date, score, tech stack, feedback status |
| Tech Stack Icon Rendering | ✅ Implemented | Resolves and validates icons via devicons CDN |
| AI Agent UI (Voice Interview) | 🟡 Partially Implemented | UI shell exists; Vapi integration is scaffolded but commented out |
| Interview Feedback | 🟡 Schema-Ready | `Feedback` type and schema exist; actual saving/fetching is not yet wired |
| Interview Generation | 🟡 Type-Ready | `AgentProps` supports `"generate"` mode; logic is pending |

---

## 3. Architecture

### Directory Structure

```
hireprep/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (font, Toaster)
│   ├── globals.css             # Global styles + custom utility classes
│   ├── (auth)/                 # Auth route group
│   │   ├── layout.tsx          # Minimal layout for auth pages
│   │   ├── sign-in/page.tsx    # Sign-in page (renders AuthForm)
│   │   └── sign-up/page.tsx    # Sign-up page (renders AuthForm)
│   └── (root)/                 # Authenticated app route group
│       ├── layout.tsx          # Nav layout (logo + children)
│       ├── page.tsx            # Dashboard (CTA + interview cards)
│       └── interview/
│           └── page.tsx        # Interview session page (renders Agent)
├── components/
│   ├── AuthForm.tsx            # Unified sign-in/sign-up form
│   ├── Agent.tsx               # AI interview agent UI
│   ├── InterviewCard.tsx       # Interview card component
│   ├── DisplayTechIcons.tsx    # Async server component for tech logos
│   ├── FormField.tsx           # Generic reusable form field wrapper
│   └── ui/                     # Shadcn/Radix UI primitives
│       ├── button.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── sonner.tsx
├── firebase/
│   ├── client.ts               # Firebase client SDK (Auth + Firestore)
│   └── admin.ts                # Firebase Admin SDK (Auth + Firestore)
├── lib/
│   ├── utils.ts                # cn(), getTechLogos(), getRandomInterviewCover()
│   └── actions/
│       └── auth.action.ts      # Server Actions: signUp, signIn, setSessionCookie
├── constants/
│   └── index.ts                # Tech name mappings, interview covers, dummy data
├── types/
│   ├── index.d.ts              # All global TypeScript interfaces
│   └── vapi.d.ts               # Vapi message/event type declarations
└── public/                     # Static assets (logos, covers, avatars, icons)
```

---

## 4. How Different Parts Interact

### Authentication Flow

```
AuthForm (client component)
  │
  ├─ [Sign Up] → createUserWithEmailAndPassword (Firebase Client Auth)
  │               → signUp() Server Action
  │                   → Firebase Admin Firestore: write user doc
  │
  └─ [Sign In] → signInWithEmailAndPassword (Firebase Client Auth)
                 → getIdToken() (short-lived JWT)
                 → signIn() Server Action
                     → auth.getUserByEmail() (Firebase Admin)
                     → setSessionCookie()
                         → auth.createSessionCookie() (Firebase Admin)
                         → next/headers cookies(): set HttpOnly cookie
```

The dual Firebase setup is intentional:
- **`firebase/client.ts`** — Used in client components for real-time auth (sign in/up gestures).
- **`firebase/admin.ts`** — Used in Server Actions to securely verify tokens, write to Firestore, and issue session cookies. Never exposed to the browser.

### Dashboard Flow

```
(root)/page.tsx
  │
  ├─ Section 1: CTA Banner + "Start an interview" button → /interview
  │
  ├─ Section 2: "Your Interviews" → maps dummyInterviews → <InterviewCard />
  │               └─ InterviewCard
  │                   ├─ getRandomInterviewCover() [from utils]
  │                   ├─ <DisplayTechIcons techStack={...} />
  │                   │   └─ getTechLogos() → normalizeTechName() → CDN icon fetch
  │                   └─ Link: /interview/:id or /interview/:id/feedback
  │
  └─ Section 3: "Take an interview" → same card display (duplicate, likely temp)
```

### Agent / Interview Flow (Partially Wired)

```
/interview page
  └─ <Agent userName={...} type="interview" />
       ├─ callStatus state: INACTIVE → CONNECTING → ACTIVE → FINISHED
       ├─ isSpeaking: hardcoded true (Vapi event listener not yet connected)
       ├─ messages[]: hardcoded placeholder array
       ├─ Transcript display: shows lastMessage with fade-in animation
       └─ Call/End button: toggles based on callStatus
```

The commented-out `interviewer` config in `constants/index.ts` reveals the planned Vapi integration using GPT-4 as the LLM, Deepgram for transcription, and ElevenLabs for voice synthesis.

---

## 5. Technologies, Frameworks & Patterns

### Core Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS v4** + custom utility classes in `globals.css` |
| UI Components | **Shadcn/UI** (Radix UI primitives + CVA) |
| Font | **Mona Sans** via `next/font/google` |
| Auth (Client) | **Firebase Auth** (email/password) |
| Database | **Firebase Firestore** |
| Auth (Server) | **Firebase Admin SDK** (session cookies) |
| AI Voice SDK | **Vapi AI** (type declarations present; wiring pending) |
| AI/LLM SDK | **`@ai-sdk/google` + `ai`** (Vercel AI SDK, for feedback generation) |
| Form Handling | **React Hook Form** + **Zod** (schema validation) |
| Date Formatting | **Day.js** |
| Notifications | **Sonner** (toast library) |

### Design Patterns Used

- **Route Groups** — `(auth)` and `(root)` for separate layouts without affecting URL paths.
- **Server Actions** (`"use server"`) — Secure server-side operations called directly from client components, avoiding dedicated API route boilerplate.
- **Dual Firebase Pattern** — Client SDK for browser gestures, Admin SDK for privileged server operations.
- **Singleton Initialization Guard** — Both `firebase/client.ts` and `firebase/admin.ts` use `getApps().length` to prevent multiple SDK instances.
- **Generic Component** — `FormField<T extends FieldValues>` is a fully generic, typed form field compatible with any React Hook Form schema.
- **Async Server Component** — `DisplayTechIcons` is an `async` React Server Component that performs network calls (CDN icon validation) at render time.
- **Enum-Driven State** — `CallStatus` enum in `Agent.tsx` drives UI state transitions cleanly.

---

## 6. Design Issues, Inefficiencies & Potential Improvements

### 🔴 Issues

1. **Hardcoded data in `Agent.tsx`** — `isSpeaking`, `messages`, and `lastMessage` are hardcoded. The Vapi event listeners (`onMessage`, `onCallStart`, `onCallEnd`) are not connected, making the interview session non-functional.

2. **Firebase API key in `firebase/client.ts`** — The client-side config object (including `apiKey`, `appId`, etc.) is committed directly in source code. While Firebase client keys are semi-public by design, they should still be managed via environment variables (`.env.local`) to be consistent with the admin credentials and to allow environment-specific configuration.

3. **Duplicate section in dashboard** — `(root)/page.tsx` renders `dummyInterviews` twice in two separate sections ("Your Interviews" and "Take an interview") with identical markup. This appears to be a placeholder before real data is fetched.

4. **`callStatus` state is unused** — The `setCallStatus` setter is defined but never called (no Vapi event wiring), so the state never transitions from `INACTIVE`.

5. **`getButtonText()` is incomplete** — It only handles `CONNECTING` and defaults to `"Call"`, but never returns `"End"` through this function (the End button is rendered separately via a ternary, which is inconsistent).

### 🟡 Inefficiencies

6. **`getTechLogos` makes N sequential CDN HEAD requests** — Each tech icon triggers a `fetch(..., { method: "HEAD" })` to the jsDelivr CDN. With `Promise.all`, these run in parallel, but a persistent caching layer (e.g., Next.js `unstable_cache` or `React.cache`) would eliminate repeated requests across renders.

7. **`getRandomInterviewCover()` is non-deterministic** — Using `Math.random()` means each render produces a different cover image per card. This causes hydration mismatches in SSR scenarios if not handled carefully.

8. **No auth guard on `(root)` layout** — The root layout wraps authenticated content but does not currently verify the session cookie. A middleware or layout-level redirect check is expected but missing, meaning unauthenticated users can access the dashboard at the routing level.

### 🟢 Suggested Improvements

9. Move Firebase client config to `.env.local` variables.
10. Add `middleware.ts` to protect `(root)` routes by verifying the session cookie server-side.
11. Replace `dummyInterviews` with real Firestore queries once the interview creation flow is implemented.
12. Implement Vapi event wiring in `Agent.tsx` using the already-defined `vapi.d.ts` message types.
13. Cache `getTechLogos` results to avoid redundant CDN round-trips.

---

## System Flow Summary

- **User visits `/sign-up`** → `AuthForm` (type=`"sign-up"`) renders → user submits → Firebase Client Auth creates user → `signUp()` Server Action writes profile to Firestore → redirect to `/sign-in`.

- **User visits `/sign-in`** → `AuthForm` (type=`"sign-in"`) renders → Firebase Client Auth verifies credentials → `getIdToken()` produces a short-lived JWT → `signIn()` Server Action validates user via Admin SDK → `setSessionCookie()` issues a 7-day HttpOnly session cookie → redirect to `/`.

- **User is on dashboard (`/`)** → `(root)/page.tsx` renders a CTA banner + two lists of `InterviewCard` components sourced from `dummyInterviews` → each card shows role, date, score placeholder, tech icons (fetched from devicons CDN via `DisplayTechIcons`), and a link to the interview or feedback page.

- **User clicks "Start an interview"** → navigates to `/interview` → `Agent` component renders an AI avatar panel, user avatar panel, a transcript display area, and a `Call / End` button governed by `CallStatus` state → **Vapi voice session integration is scaffolded but not yet active** (commented out in constants).

- **Post-interview (planned)** → Vapi sends transcript → Server Action uses `@ai-sdk/google` to parse and score the transcript against a `feedbackSchema` → `Feedback` record is saved to Firestore → `InterviewCard` links to `/interview/:id/feedback`.
