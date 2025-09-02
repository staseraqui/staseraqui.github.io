PASSI SEMPLICI (subito, senza backend)
1) Vai su GitHub → staseraqui/staseraqui.github.io
2) Add file → Upload files → carica TUTTO il contenuto di questo ZIP (cartella assets inclusa)
3) Commit → vai su https://www.staseraqui.it e prova i filtri
4) Pubblica evento: al click su “Conferma” si apre una email con i dati (se non configuri ancora il backend)

QUANDO VORRAI PAGAMENTI E SALVATAGGIO AUTOMATICO
- Crea account Supabase e Stripe (gratis per partire)
- Incolla 4 valori dentro assets/config.js (le chiavi ti dico io dove prenderle)
- Su Supabase incolla lo SQL di sql/supabase_schema.sql e premi Run
- Fine: “Conferma” salverà nel DB e potrai collegare Stripe per il pagamento
