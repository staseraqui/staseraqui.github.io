# Sistemi & Servizi

Compilare i **campi DA COMPILARE** e salvare.

| Area | Fornitore | Scopo | Note / Dati |
|------|-----------|-------|-------------|
| Dominio | Aruba | Registrar dominio | Dominio: **staseraqui.it** |
| DNS | **DA COMPILARE** (Aruba/Cloudflare) | Risoluzione DNS | Indicare dove puntano A/AAAA/CNAME (root e www) |
| Hosting statico | **DA COMPILARE** | Hosting sito | Es. GitHub Pages / Cloudflare Pages |
| Supabase | supabase.com | DB Postgres, Storage, Edge Functions | Project: `rubdzlnolxcgpjklfggk` — URL: `https://rubdzlnolxcgpjklfggk.supabase.co` |
| Stripe | stripe.com | Pagamenti | Prezzi: `STRIPE_PRICE_SINGLE` / `STRIPE_PRICE_MULTI` (Price ID); Webhook: **DA COMPILARE (se usato)** |
| Resend | resend.com | Email transazionali | Dominio verificato: **DA COMPILARE** |
| Google Maps | console.cloud.google.com | Geocoding / Directions | API key: conservata in `.env` (vedi ACCESSI.md) |
| Google Analytics 4 | analytics.google.com | Analytics | ID proprietà: `G-SDBGY51C46` |
| GitHub | github.com | Codice e versionamento | Repo: **DA COMPILARE (org/owner/repo)** |

## Componenti applicative
- **Bucket Storage**: `event-images`
- **Edge Function**: `create-checkout-session`
- **Tabelle DB** (principali):  
  - `events` (evento)  
  - `occurrences` (date/luoghi)  
  - `checkout_bundles` (bundle inviati a Stripe, con `session_id` e `items`)
- **Sicurezza/RLS**: funzioni `jwt_email()`, `is_admin()`; policies su tabelle pubbliche (in particolare su `occurrences`, `events`).
