# Accessi & Credenziali (senza segreti nel repo)

> **Importante**: NON inserire qui password/chiavi.  
> Indicare **dove** sono custodite (es. password manager, cassaforte fisica, account titolare).

## Chi deve avere accesso (e a cosa)
- **Cloudflare (DNS)**: solo chi deve gestire DNS/certificati.
- **GitHub (codice/hosting Pages)**: sviluppatori che pubblicano il sito.
- **Supabase (DB + Functions)**: sviluppatori/amministratori applicazione.
- **Stripe (pagamenti)**: responsabili amministrazione/contabilità + tecnico.
- **Resend** (se usato): chi gestisce email transazionali.
- **Google Analytics**: chi legge statistiche.
  
## Custodia chiavi / segreti
- Password manager utilizzato: **Apple Password**  
- Titolare: Andrea Cordero (email: andrea.cordero@staseraqui.it)

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

## Come concedere accesso (passi semplici)

### A) GitHub
1. Apri il **repo** → **Settings** → **Collaborators & teams**.
2. **Add people** → inserisci l’email GitHub della persona.
3. Ruolo suggerito: **Write** (può fare commit) o **Admin** (se deve gestire impostazioni/Pages).

### B) Cloudflare
1. Cloudflare → in alto **Account** → **Members**.
2. **Invite member** → email.
3. Ruolo: **Administrator** solo se deve toccare DNS; altrimenti **DNS editor**.

### C) Supabase
1. Progetto → **Settings** → **Members** → **Invite member**.
2. Inserisci email → ruolo **Developer** (basta per DB/Functions) o **Admin**.

### D) Stripe
1. **Settings** (ingranaggio) → **Team**.
2. **+ New user** → email → scegli ruolo (es. **Analyst** o **Developer**).

### E) Resend (se usato)
1. **Team** → **Invite member** → email → (Admin/Member).

### F) Google Analytics
1. **Admin** (ingranaggio) → **Account access management** (o **Property access**).
2. **+** → **Add users** → email → ruolo **Viewer** o **Editor**.

## Come revocare accesso (passi semplici)
- **GitHub**: Repo → Settings → Collaborators → **Remove**.  
- **Cloudflare**: Account → Members → **Remove**.  
- **Supabase**: Settings → Members → **Remove**.  
- **Stripe**: Settings → Team → **Remove**.  
- **Resend**: Team → **Remove**.  
- **Analytics**: Admin → Access management → **Remove**.

> Suggerimento: quando cambi fornitore, **rimuovi subito** gli utenti che non servono più e, se condivise, **ruota le chiavi** (vedi “Procedure rapide”).
