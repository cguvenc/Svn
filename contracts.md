# SVN MAKİNA - API Contracts & Integration Plan

## Goal
Turn the mock frontend into a full-stack app with a bilingual (TR/EN), easily manageable admin panel (JWT auth).

## Auth
- POST /api/auth/login { username, password } -> { access_token, token_type }
- GET /api/auth/me (Bearer) -> { username }
- Seeded admin: admin / admin123 (bcrypt hashed). JWT HS256, 7d expiry.

## Public endpoints (no auth)
- GET /api/settings -> site settings (contact info, hero, about) bilingual
- GET /api/services -> list ordered
- GET /api/team -> list ordered
- GET /api/faqs -> list ordered
- POST /api/service-requests { name, phone, email?, subject?, message } -> created (contact form)

## Admin endpoints (Bearer JWT)
- PUT /api/settings (update)
- Services:  POST /api/services | PUT /api/services/{id} | DELETE /api/services/{id}
- Team:      POST /api/team | PUT /api/team/{id} | DELETE /api/team/{id}
- FAQs:      POST /api/faqs | PUT /api/faqs/{id} | DELETE /api/faqs/{id}
- Requests:  GET /api/service-requests | PATCH /api/service-requests/{id} (mark read) | DELETE /api/service-requests/{id}

## Models (bilingual with *_tr / *_en fields), all use string uuid `id`
- Service: id, order, icon_key, image_url, title_tr, title_en, desc_tr, desc_en
- TeamMember: id, order, name, title_tr, title_en, phone, phone_raw, email, avatar
- Faq: id, order, q_tr, q_en, a_tr, a_en
- Settings: brand, phone, phone_raw, whatsapp, email, email2, address_line, map_query,
            instagram, facebook, linkedin,
            hero_title_tr/en, hero_subtitle_tr/en,
            about_p1_tr/en, about_p2_tr/en, about_points_tr[], about_points_en[]
- ServiceRequest: id, name, phone, email, subject, message, is_read, created_at

## Seeding
On startup, if collections empty, seed from the same data used in mock.js (services, team, faqs, settings) so site is populated.

## Frontend integration
- Add /src/api.js (axios instance with REACT_APP_BACKEND_URL + /api, token interceptor).
- Add ContentContext to fetch settings/services/team/faqs once; components read from it (fallback to mock CONTENT for static UI labels: nav, buttons, taglines).
- Contact form -> POST /api/service-requests (replace localStorage mock).
- Static UI labels (nav, buttons, page titles, taglines, features) stay in mock.js CONTENT (not admin-managed to limit scope).
- Admin panel routes: /admin/login, /admin (tabbed dashboard: Talepler, Hizmetler, Personel, SSS, Ayarlar). Not in public header.

## Notes
- Keep '/api' prefix on all routes. Use MONGO_URL & REACT_APP_BACKEND_URL from env only.
