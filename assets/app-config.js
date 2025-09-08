<!-- assets/app-config.js -->
<script>
// assets/app-config.js — CONFIG UNICA (con prezzi visivi)
window.SQ_CONFIG = {
  // Supabase
  SUPABASE_URL: "https://rubdzlnolxcgpjklfggk.supabase.co",
  SUPABASE_ANON: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YmR6bG5vbHhjZ3Bqa2xmZ2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTI3NjQsImV4cCI6MjA3MjQ2ODc2NH0.Fhq7lKdx1OcyuCWOnHqNH7Omsg7qjdQVzxvNqZyeQQ8",

  // Google Maps
  GOOGLE_MAPS_API_KEY: "AIzaSyCfLAJyhmA_lu6jP0Y1GbgVTvSn2nIICsg",

  // Prezzi (SOLO per mostrare in pagina; Stripe resta come già configurato)
  PRICE_SINGLE_EUR: 9,   // evento con 1 occorrenza
  PRICE_MULTI_EUR: 14    // evento con 2+ occorrenze fino ad un massimo di 4 occorrenze diverse
};
</script>
