<div align="center">

<img src="public/email-logo.png" alt="EduSpark"  />



### The modern, role-aware tutoring marketplace — built for scale.

**AI-powered tutor matching · Live HD classrooms · Multi-role dashboards · Production-grade RBAC**


<p>
  <a href="https://edu-spark-zone.vercel.app"><img src="https://img.shields.io/badge/▶_Live_Demo-0F172A?style=for-the-badge" /></a>
  <a href="#-product-showcase"><img src="https://img.shields.io/badge/📸_Screenshots-7C3AED?style=for-the-badge" /></a>
  <a href="#-architecture"><img src="https://img.shields.io/badge/🏗_Architecture-10B981?style=for-the-badge" /></a>
  <a href="#-author">  <img src="https://img.shields.io/badge/👋_Hire_Me-F59E0B?style=for-the-badge" /></a>
</p>

<br/>

<img src="public/readme/banner.png" alt="EduSpark Banner" width="100%" />

</div>

---

## ✨ Why EduSpark?

EduSpark isn't a CRUD demo — it's a **full-stack, multi-tenant marketplace** that solves real problems: matching students with vetted tutors, conducting live HD lessons in-browser, processing earnings, moderating content, and handing operators a control plane to run the whole platform.

> Built with the same architectural patterns that power **Cal.com**, **Preply**, and **Superprof** — Row-Level Security on every table, role-segmented dashboards, edge functions for AI and video, and a code-split bundle that ships only what each route needs.

---

## 📸 Product Showcase

<div align="center">

<table>
<tr>
<td width="50%"><img src="public/readme/hero-home.png" alt="Landing page" /><p align="center"><b>Landing</b> — animated hero, live stats, social proof</p></td>
<td width="50%"><img src="public/readme/dashboard.png" alt="Student dashboard" /><p align="center"><b>Student Dashboard</b> — sessions, spend, study analytics</p></td>
</tr>
<tr>
<td width="50%"><img src="public/readme/live-classroom.png" alt="Live classroom" /><p align="center"><b>Live Classroom</b> — Daily.co token-gated HD video</p></td>
<td width="50%"><img src="public/readme/categories.png" alt="Categories" /><p align="center"><b>Explore</b> — semantic search across 50+ subjects</p></td>
</tr>
<tr>
<td width="50%"><img src="public/readme/auth.png" alt="Auth" /><p align="center"><b>Auth</b> — role selection on signup, OAuth-ready</p></td>
<td width="50%"><img src="public/readme/how-it-works.png" alt="How it works" /><p align="center"><b>How It Works</b> — guided onboarding flow</p></td>
</tr>
</table>

</div>

---

## 🎯 Core Features by Role

EduSpark is built around **5 distinct user roles**, each with its own gated dashboard, RLS scope, and feature set.

<details>
<summary><b>🎓 Student</b> — discover, book, learn</summary>

- AI-powered tutor matching via natural-language search ("help me prep for SAT calculus")
- Browse 50+ subjects with rating, price, and language filters
- Save favorite tutors, message them, view detailed profiles with availability grids
- Book sessions with calendar-aware availability
- Join live HD video classrooms with token-gated rooms
- Personal dashboard: study hours, spend, sessions, payment history
- Submit reviews after completed sessions
</details>

<details>
<summary><b>👩‍🏫 Tutor</b> — teach, earn, grow</summary>

- Multi-step verified onboarding with document upload
- Manage weekly availability (drag-to-set time slots)
- Accept / decline incoming bookings
- Earnings wallet with **$10 minimum withdrawal** + payout request flow
- Recent withdrawals widget with status badges
- Reviews dashboard with rating distribution analytics
- Settings: hourly rate, subjects, bio, languages
</details>

<details>
<summary><b>🛡️ Moderator</b> — keep the platform clean</summary>

- Approve / reject tutor verification submissions
- Manage CMS (blog posts, categories, FAQs)
- Triage support tickets and contact messages
- Audit live and completed sessions
- User management with soft-suspend
</details>

<details>
<summary><b>👑 Admin</b> — operate at scale</summary>

- Platform-wide overview: users, sessions, GMV, conversion
- Finance: payment ledger, withdrawal approvals, refund handling
- Full user CRUD with role assignment
- Reports & analytics (revenue, growth, retention)
- Global system settings
</details>

<details>
<summary><b>🔧 Technician</b> — fix what breaks</summary>

- Issue queue with severity triage
- System health dashboard
- Settings panel for diagnostics
</details>

---

## 🏗️ Architecture

```
                    ┌──────────────────────────────┐
                    │     React 18 SPA  (Vite)     │
                    │  • TanStack Query • Tailwind │
                    │  • Framer Motion  • shadcn   │
                    └──────────┬───────────────────┘
                               │ HTTPS / JWT
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼────────┐   ┌─────────▼──────────┐   ┌──────▼──────────┐
│  Supabase DB   │   │   Edge Functions   │   │  Lovable Cloud  │
│  Postgres + RLS│   │  (Deno runtime)    │   │  Auth · Storage │
│  has_role()    │   │  • ai-tutor-search │   │                 │
│  user_roles    │   │  • create-meeting  │   └─────────────────┘
└────────────────┘   │  • get-meeting-tkn │
                     │  • end-meeting     │
                     └────────┬───────────┘
                              │
                  ┌───────────┴────────────┐
                  │                        │
          ┌───────▼────────┐     ┌─────────▼─────────┐
             Gemini 2.5 ⚡             Daily.co    
                                    HD Video Rooms
                
          └────────────────┘     └───────────────────┘
```

---

## 🛠️ Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_3-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?logo=shadcnui&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_6-CA4245?logo=reactrouter&logoColor=white)

**State / Data**

![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Deno](https://img.shields.io/badge/Deno_Edge-000000?logo=deno&logoColor=white)
![REST API](https://img.shields.io/badge/API-REST-02569B)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)
![JWT Auth](https://img.shields.io/badge/Auth-JWT-black)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
**AI / Realtime**
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?logo=google&logoColor=white)
![Daily.co](https://img.shields.io/badge/Daily.co-1E2A3A?logo=webrtc&logoColor=white)

**Tooling**
![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)

---

## 🔐 Security Highlights

> Security isn't an afterthought — it's enforced at the **database level**, not the UI.

- **Row-Level Security on every table** — `bookings`, `payments`, `withdrawals`, `reviews`, `messages`, all gated.
- **Roles in a separate table** — `user_roles` with an enum `app_role`. **Never** stored on the profile to prevent privilege escalation.
- **`has_role()` security-definer function** — bypasses RLS recursion, used in every policy:
  ```sql
  create policy "Students can insert bookings"
    on bookings for insert
    with check (public.has_role(auth.uid(), 'student'));
  ```
- **Token-gated video rooms** — Daily.co tokens minted only inside an edge function after verifying the caller is the booking's student or tutor, within the join window.
- **JWT-validated edge functions** — every function re-validates the user via `supabase.auth.getUser()` before touching data.
- **No secrets in the client** — Daily API key, AI gateway key live in edge function env only.

---

## ⚡ Performance Wins

| Optimization | Impact |
|---|---|
| Vendor `manualChunks` (react / ui / data / chart / form) | Cacheable splits, smaller deltas on deploy |
| `React.lazy` + `Suspense` on dashboard routes | Initial JS payload **< 200 KB gzip** |
| Code-split AI search & video call screens | Pay only when used |
| `cssCodeSplit: true`, `minify: 'esbuild'` | Faster builds, smaller CSS chunks |
| TanStack Query cache + `staleTime` tuning | Sub-100 ms perceived navigation |
| Tailwind JIT + tree-shaken `lucide-react` icons | Tiny CSS, no icon bloat |
| Skeleton screens on every async surface | Zero CLS, premium perceived perf |

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/habiburRhaman05/EduSpark-modern-learning-platfrom.git 

cd eduspark

# 2. Install (Bun is fastest, npm/pnpm work too)
bun install

# 3. Run
bun dev
```

The app boots at `http://localhost:8080`. Backend (Lovable Cloud / Supabase) is auto-provisioned — no `.env` setup needed for local dev.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── booking/          # Booking dialog & flow
│   ├── call/             # Video room, device preview, waiting room
│   ├── dashboard/        # Reusable: DataTable, StatCard, FilterBar, GlobalSearch (⌘K)
│   ├── landing/          # Hero, FeaturedTutors, CTA, Stats, FAQ
│   ├── tutor/            # Onboarding wizard, AI search, withdrawals
│   └── ui/               # shadcn primitives (50+ tokens)
├── hooks/                # Domain hooks: useBookings, useTutorEarnings, useAITutorSearch...
├── pages/
│   ├── admin/            # 10 admin views
│   ├── moderator/        # 8 moderator views
│   ├── student/          # 6 student views
│   ├── tutor/            # 9 tutor views
│   └── technician/       # 3 technician views
├── contexts/             # AuthContext (role-aware)
├── integrations/         # Supabase client + generated types
└── skeletons/            # Layout-matched shimmer states

```

---

## 🗺️ Roadmap

- [x] Multi-role dashboards (Student / Tutor / Moderator / Admin / Technician)
- [x] AI-powered tutor matching (Gemini 2.5 Flash)
- [x] HD video classrooms (Daily.co)
- [x] Tutor earnings + withdrawal flow with $10 minimum
- [x] RLS-gated booking creation (students only)
- [x] Modern paginated tables across all listings
- [x] Bundle code-splitting & lazy routes
- [x] ⌘K global search palette
- [ ] Stripe + bKash live payments (currently mock ledger)
- [ ] Real-time chat (Supabase Realtime)
- [ ] Mobile native apps (React Native)
- [ ] Group classes (1 tutor → many students)

---

## 👋 Author

<div>

**Built by [Habibur Rhaman](mailto:mdwear2005@gmail.com)** — full-stack engineer focused on production-grade React + TypeScript + Postgres systems.

📫 **Email**: devhabib2005@gmail.com
🌐 **Portfolio**: https://rhaman.vercel.app
💼 **LinkedIn**: https://www.linkedin.com/in/habiburrhaman05
🐙 **GitHub**: https://github.com/habiburRhaman05

</div>

---

<div align="center">

**If this project caught your eye, ⭐ it on GitHub — and let's talk.**

<sub>Built with ❤️ Habibur Rhaman </sub>

</div>
