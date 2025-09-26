# Procedure rapide (passo-passo, senza gergo)

## 1) Cambiare i PREZZI visibili sul sito
1. Apri **GitHub** → repo del sito → cartella **assets** → file **app-config.js**.
2. Modifica i valori:  
   - `PRICE_SINGLE_EUR = ...`  
   - `PRICE_MULTI_EUR = ...`
3. Salva (Commit) → attendi la pubblicazione.
4. Controlla in **prezzi-condizioni.html** che i prezzi appaiano corretti.

> Se usi prezzi fissi in **Stripe** (Price ID): i Price ID NON cambiano. Aggiorni i prezzi in Stripe solo se cambi listino lato Stripe. In quel caso, aggiorna i **Price ID** nelle **env** della funzione (vedi punto 3).

## 2) Aggiornare l’email Resend (se usata)
1. Vai su **Resend** → Settings → API Keys → **Create** nuova chiave.  
2. Copia la nuova chiave.
3. Vai su **Supabase** → **Functions** → seleziona la funzione che usa Resend → **Settings** → **Environment variables** → incolla la nuova chiave nella variabile giusta (es. `RESEND_API_KEY`) → **Save**.
4. Fai un invio di prova (es. azione che invia email) per verificare.
5. Torna su Resend → **disattiva** la **vecchia** chiave.

## 3) Aggiornare i Price ID Stripe usati dal checkout
1. **Stripe** → Products → apri il prodotto → **Prices** → copia gli **ID prezzo** (es. `price_...`).
2. **Supabase** → **Functions** → `create-checkout-session` → **Settings** → **Environment variables**:  
   - `STRIPE_PRICE_SINGLE = price_...`  
   - `STRIPE_PRICE_MULTI  = price_...`  
   → **Save**.
3. Fai una **Checkout test** in **Stripe Test Mode** per verificare.

## 4) Dare accesso ad una software house (riassunto)
1. **GitHub**: aggiungi come **Collaborator** sul repo (ruolo “Write” o “Admin”).  
2. **Supabase**: Settings → Members → **Invite** (ruolo “Developer”).  
3. **Stripe**: Settings → Team → **New user** (ruolo “Developer” o “Analyst”).  
4. **Cloudflare**: Account → Members → **Invite** (ruolo “DNS editor” o “Administrator”).  
5. **Analytics**: Admin → Add users (ruolo “Viewer” o “Editor”).  
6. (Opzionale) **Resend**: Team → Invite.

## 5) Togliere accesso a fine rapporto
1. **Rimuovi utenti** da GitHub / Supabase / Stripe / Cloudflare / Analytics / Resend (vedi ACCESSI.md).  
2. Se hai **condiviso chiavi** (API Keys, Service Role, ecc.):
   - Crea **nuova chiave** (sul servizio).
   - Aggiorna il valore nei **posti dove è usata** (es. Supabase Functions → Environment variables).
   - **Testa** che tutto funzioni.
   - **Disattiva** la **vecchia** chiave.

## 6) Mettere un banner “manutenzione” (senza spegnere il sito)
1. Modifica **index.html**: aggiungi un `<div class="banner">Sito in manutenzione (torniamo tra poco)</div>` all’inizio del `<main>`.  
2. Commit su GitHub → quando finito, rimuovi lo stesso blocco.

> Spegnere del tutto il sito non è consigliato; meglio un banner o una pagina di cortesia temporanea.
