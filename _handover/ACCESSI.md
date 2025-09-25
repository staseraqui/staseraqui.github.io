# Accessi & Credenziali (senza segreti nel repo)

> **Importante**: NON inserire qui password/chiavi.  
> Indicare **dove** sono custodite (es. password manager, cassaforte fisica, account titolare).

## Custodia chiavi / segreti
- Password manager utilizzato: **DA COMPILARE**  
- Titolare: Andrea (email: info@staseraqui.it)

## Variabili ambiente (Edge Function / Supabase)
Queste sono i **nomi** delle variabili; i valori sono nel password manager:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_SINGLE`
- `STRIPE_PRICE_MULTI`
- `SUCCESS_URL` (es. `https://staseraqui.it/grazie.html`)
- `CANCEL_URL`  (es. `https://staseraqui.it/cancel.html`)
- `SUPABASE_URL` (= `https://rubdzlnolxcgpjklfggk.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` (segreto)
- `MAX_DAYS_PER_EVENT` (opzionale, default 60)
- `GOOGLE_MAPS_API_KEY` (frontend: in `assets/app-config.js` o su Pages come env pubblica)

## Accessi piattaforme
- **Supabase**: utente: **DA COMPILARE** (email); 2FA: **DA COMPILARE**
- **Stripe**: utente: **DA COMPILARE**; 2FA: **DA COMPILARE**
- **Resend**: utente: **DA COMPILARE**
- **Google Cloud (Maps)**: account: **DA COMPILARE**
- **Google Analytics**: account: **DA COMPILARE**
- **GitHub**: org/repo: **DA COMPILARE**
- **Aruba** (registrar): account: **DA COMPILARE**
- **Cloudflare** (se usato per DNS/Pages): account: **DA COMPILARE**

## Procedure rapide
- **Rotazione chiave Stripe**: crea nuova secret → aggiorna env su Supabase Edge → ri-deploy → disattiva vecchia.
- **Rotazione Service Role**: genera nuova nel progetto Supabase → aggiorna env Edge → test → revoca vecchia.
- **Revoca accessi** (software house uscente): rimuovere utenti da: GitHub, Supabase, Stripe, Cloudflare, Resend, Google.
