# Dossier di Consegna — StaseraQui.it

Questo dossier spiega **cos'è il progetto**, **dove vive**, **come si avvia in locale**, **come si pubblica**, **chiavi e servizi**.  
È pensato per: nuova software house, consulenti, revisori contabili/fiscali.

## Architettura in breve
- **Frontend**: sito statico (HTML/CSS/JS).
- **Dati**: Supabase (Postgres + Storage + Edge Functions).
- **Pagamenti**: Stripe (Checkout + ricezione metadati).
- **Email**: Resend (invii transazionali, se abilitati).
- **Geografia**: Google Maps (API JS per geocoding/route) + Leaflet/OSM.
- **Analytics**: Google Analytics 4 (caricato solo dopo consenso cookie).
- **Dominio**: staseraqui.it (registrar: Aruba). DNS attuale: **Cloudflare**.

## Link rapidi
- Sito: https://www.staseraqui.it/
- Supabase Project URL: https://rubdzlnolxcgpjklfggk.supabase.co
- Edge Function (checkout): https://rubdzlnolxcgpjklfggk.functions.supabase.co/create-checkout-session
- GA4 ID: G-SDBGY51C46

## Avvio sviluppo locale (solo lettura)
È un sito statico: basta clonare il repo e aprire `index.html` con un server statico (es. “Live Server” di VSCode).
> **Nota**: le chiavi pubbliche sono in `assets/app-config.js`. Le chiavi segrete NON sono nel repo (vedi `ACCESSI.md`).

## Pubblicazione
Il sito viene servito come statico (hosting **GitHub Pages**).  
La pubblicazione avviene **commit → push** su `main` (o sul branch configurato per l’hosting).

## Dove sono i pezzi critici
- **Funzione pagamenti**: Supabase Edge → `create-checkout-session`
- **Bucket immagini**: Supabase Storage → `event-images`
- **Tabelle principali**: `events`, `occurrences`, `checkout_bundles`
- **Metadati pagamento**: campo `items` in `checkout_bundles`
- **RLS/permessi**: funzioni `jwt_email()`, `is_admin()`, policies su tabelle pubbliche

## Contatti operativi
- Referente: Andrea Cordero — info@staseraqui.it
