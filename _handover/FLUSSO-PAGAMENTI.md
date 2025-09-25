# Flusso Pagamenti & Tracciabilità (per controllo e per Agenzia Entrate)

## Riassunto
1. L’utente crea uno o più eventi in carrello (frontend).
2. Clic su "Vai al pagamento": il client invia a **Edge Function** `create-checkout-session` un `bundle` (array di item).
3. L’Edge Function:
   - crea la **Checkout Session** su Stripe con le **line items** (prezzi: single/multi),
   - salva su Supabase tabella `checkout_bundles` il record `{ session_id, items }`.
4. Utente paga su Stripe → redirect `SUCCESS_URL`.

## Dati registrati
- **Supabase → `checkout_bundles`**:
  - `session_id` (chiave Stripe per riconciliare),
  - `items` (JSON) con:
    - `tipo` = `single` | `multi`
    - `metadata`: `titolo`, `descr` (riassunto), `prezzo` (testo libero), `locandina_url`, `cats` (pipe-separated),  
      `occ` (JSON string dei singoli giorni + geocoding), `submitter_*`, `partner` (codice, se presente)

> Nota: per limiti di metadati Stripe, lato client imponiamo un guard-rail (se il periodo genera troppi giorni → chiediamo di spezzare l’annuncio).

## Riconciliazione contabile
- **Chiave primaria**: `session_id` (Stripe) ⇄ `checkout_bundles.session_id` (DB).
- **Report Stripe**: estrazione movimenti/fees/rimborsi.  
- **Report interno**: query su `checkout_bundles` per conteggio bundle, tipologie, partner code usati.
- **Fatturazione**: gestita dal profilo fiscale su Stripe (impostazioni fiscali del tuo account).

### Query esempio (Supabase)
- Bundle per intervallo data:
```sql
select session_id, created_at, items
from checkout_bundles
where created_at between :dal and :al
order by created_at desc;
