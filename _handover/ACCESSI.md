# Accessi & Credenziali (senza segreti nel repo)

> **Importante**: NON inserire qui password/chiavi.  
> Indicare **dove** sono custodite (es. password manager, cassaforte fisica, account titolare).

## Custodia chiavi / segreti
- Password manager utilizzato: **Apple Password**  
- Titolare: Andrea Cordero (email: info@staseraqui.it)

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
- **Supabase**: utente: **info@staseraqui.it** (email); 2FA: **DA COMPILARE**
- **Stripe**: utente: **andrea.cordero@staseraqui.it**; 2FA: **DA COMPILARE**
- **Resend**: utente: **info@staseraqui.it**
- **Google Cloud (Maps)**: account: **andrea.cordero75@gmail.com**
- **Google Analytics**: account: **andrea.cordero75@gmail.com**
- **GitHub**: org/repo: **staseraqui/staseraqui.github.io**
- **Aruba** (registrar): account: **3422114@aruba.it**
- **Cloudflare** (se usato per DNS/Pages): account: **andrea.cordero@staseraqui.it**

## Procedure rapide
- **Rotazione chiave Stripe**: crea nuova secret → aggiorna env su Supabase Edge → ri-deploy → disattiva vecchia.
- **Rotazione Service Role**: genera nuova nel progetto Supabase → aggiorna env Edge → test → revoca vecchia.
- **Revoca accessi** (software house uscente): rimuovere utenti da: GitHub, Supabase, Stripe, Cloudflare, Resend, Google.
