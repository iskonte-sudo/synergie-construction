# PRD — Synergie Construction Group

## Original Problem Statement
Completely recreate the website `synergieconstruction.com` with a modern, premium, mobile-optimised design. Deliverables:
- Public marketing site clone (French)
- Project Simulator (multi-step)
- Dynamic service-specific quote forms
- Comprehensive custom **CMS** (Admin Dashboard) to manage **all** site content (sliders, menus, pages, texts, images, services, projects, testimonials, FAQs, team, blog) dynamically, without code changes.

## User Personas
- **Visitor** (prospect): browses services/realisations, requests a quote, uses simulator.
- **Editor / Admin** (client team): manages content, quotes, blog, media via `/admin`.
- **Super Admin**: full CRUD + user management.

## Tech Stack
- **Frontend**: React + React Router + Tailwind + shadcn/ui + lucide-react + sonner + axios
- **Backend**: FastAPI + Motor (MongoDB async) + JWT (`pyjwt`, `bcrypt`)
- **DB**: MongoDB (Mongo Motor async client). DO NOT migrate to Postgres.
- **Media**: local uploads (`/backend/uploads`) served by FastAPI StaticFiles

## Architecture
- `/app/frontend/src/pages/` — public pages
- `/app/frontend/src/pages/admin/` — admin dashboard
- `/app/frontend/src/hooks/useContent.js` — dynamic key/value CMS
- `/app/frontend/src/hooks/useServices.js` — dynamic services (list + by slug)
- `/app/backend/server.py` — all API routes
- `/app/backend/models.py` — Pydantic models
- Admin auth: JWT, seeded super_admin

## Key Endpoints
- `POST /api/auth/login`
- `GET /api/public/content`, `POST /api/admin/content/bulk`
- `GET /api/public/services`, `GET /api/public/services/{slug}`
- `POST /api/admin/services`, `PATCH /api/admin/services/{id}`, `DELETE /api/admin/services/{id}`
- Full CRUD for quotes, projects, testimonials, FAQ, menu, slides, team, blog

## Implemented (as of 2026-02)
- Full UI clone (header, hero slider, services grid, features, projects grid, testimonials, FAQ, footer, contact)
- Project Simulator (multi-step, saves to DB, returns estimates)
- Service-specific quote modals
- Admin dashboard with JWT auth, dark mode
- CRUD for: quotes, projects, services, simulator config, testimonials, FAQ, menu, slides, team, blog posts, media
- Global CMS content editor (key/value `content_blocks`)
- **Services CMS — 2026-02-29** ✅ NEW
  - Extended `Service` model: `hero_image`, `gallery[]`, `sub_services[]`, `faqs[]`, `cta_title`, `cta_text`, `cta_button_label`, `seo_title`, `seo_description`, `seo_og_image`
  - New public endpoint `GET /api/public/services/{slug}`
  - Services auto-seeded at startup with 6 default services
  - Admin tabbed form (8 tabs: Info, Contenu, Caractéristiques, Prestations, Galerie, FAQ, CTA, SEO)
  - Frontend `ServiceDetail.jsx` fully dynamic (fetches by slug), renders all rich sections conditionally
  - `ServicesGrid.jsx` + `Footer.jsx` now fetch services from backend via `useServices` hook
  - Tested: 7/7 backend, 100% frontend flows

## Roadmap

### P1 — Remaining CMS integrations
- Wire `About.jsx`, `Contact.jsx`, `PageBanner.jsx`, home Processus section to `useContent` hook
- Extended CMS keys for footer text (some already done, verify)

### P2 — Enhancements
- WYSIWYG editor for long_description and blog posts (TipTap/Quill)
- Email notifications for new quotes (SendGrid or Resend) — requires user API key
- Automatic WebP compression for media uploads
- Unique index on `services.slug` to prevent duplicates
- Split `server.py` into routers (services, admin, public) — 1150+ lines
- `ServiceUpdate` model with Optional fields for true PATCH semantics

### P3 — Future
- Live preview before publish
- Multi-language (FR/EN)
- Google Analytics / GA4 integration
- Sitemap.xml + robots.txt auto-generation

## Admin Credentials
See `/app/memory/test_credentials.md`
