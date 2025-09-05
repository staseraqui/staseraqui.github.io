// =========================
// Stasera Qui - App Config
// =========================
//
// Inserisci qui i TUOI valori reali.
// ATTENZIONE: NON inserire mai la Service Role Key (solo la anon public).
// Assicurati che in Google Cloud la chiave sia limitata ai referer del dominio
// e che siano abilitate "Maps JavaScript API" e "Geocoding API".

(function(){
  // Se l'oggetto globale non esiste, lo creo
  if (!window.SQ_CONFIG) window.SQ_CONFIG = {};

  // === DA COMPILARE ===
  window.SQ_CONFIG.SUPABASE_URL = "https://rubdzlnolxcgpjklfggk.supabase.co";      // <- Project URL (Supabase → Settings → API)
  window.SQ_CONFIG.SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YmR6bG5vbHhjZ3Bqa2xmZ2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTI3NjQsImV4cCI6MjA3MjQ2ODc2NH0.Fhq7lKdx1OcyuCWOnHqNH7Omsg7qjdQVzxvNqZyeQQ8";                     // <- anon public key (Supabase → Settings → API)
  window.SQ_CONFIG.GOOGLE_MAPS_API_KEY = "AIzaSyCfLAJyhmA_lu6jP0Y1GbgVTvSn2nIICsg";           // <- API key (Maps JS + Geocoding abilitate)

  // === Opzioni (già ok così, non obbligatorie) ===
  // Se vuoi cambiare il bias paese del geocoding senza toccare il codice:
  window.SQ_CONFIG.GEOCODING_COUNTRY = "IT";   // usato per forzare ricerca in Italia
  window.SQ_CONFIG.GEOCODING_REGION  = "it";   // usato per 'region' = it
  window.SQ_CONFIG.GEOCODING_LANG    = "it";   // lingua dei risultati

  // Di utilità per cache-busting (versione config)
  window.SQ_CONFIG.VERSION = "1.0.0";
})();
