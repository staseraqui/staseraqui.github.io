// assets/app-config.js — CONFIG UNICA (con prezzi in vetrina)
window.SQ_CONFIG = {
  // Supabase
  SUPABASE_URL: "https://rubdzlnolxcgpjklfggk.supabase.co",
  SUPABASE_ANON: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1YmR6bG5vbHhjZ3Bqa2xmZ2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTI3NjQsImV4cCI6MjA3MjQ2ODc2NH0.Fhq7lKdx1OcyuCWOnHqNH7Omsg7qjdQVzxvNqZyeQQ8",

  // Google Maps
  GOOGLE_MAPS_API_KEY: "AIzaSyCfLAJyhmA_lu6jP0Y1GbgVTvSn2nIICsg",

  // Prezzi mostrati in “Prezzi & Condizioni”
  PRICE_SINGLE_EUR: 9,
  PRICE_MULTI_EUR: 14,

  // ===== Tassonomia categorie → sotto-categorie (ispirata a Eventbrite) =====
  // NB: i nomi coincidono con le 8 categorie già presenti su Stasera Qui, così non rompiamo nulla.
  EB_TAXONOMY: {
    "Musica": [
      "Rock","Jazz & Blues","Classica","Elettronica","Hip-Hop / Rap","Indie / Alternative",
      "Pop","Metal","Folk / Acustico","Country","Latina","R&B / Soul","DJ / Dance","Cantautori"
    ],
    "Food & Drink": [
      "Degustazioni","Birra","Vino","Distillati","Street Food","Festival enogastronomici",
      "Corsi di cucina","Cene sociali","Caffè / Tea","Mixology / Cocktail"
    ],
    "Nightlife": [
      "Discoteca / Club","DJ set","Karaoke","Latin Night","Aperitivo","Serata a tema"
    ],
    "Cultura/Spettacolo": [
      "Teatro","Arti visive / Mostre","Cinema / Proiezioni",
      "Danza","Letture / Presentazioni","Opera / Operetta"
    ],
    "Famiglie & Bambini": [
      "Laboratori","Spettacolo bambini","Letture animate","Giochi / Animazione",
      "Feste di paese","Parchi / Outdoor"
    ],
    "Sport": [
      "Calcio","Running / Corsa","Ciclismo","Trekking / Escursioni",
      "Fitness / Wellness","Tornei","Arti marziali"
    ],
    "Sagre & Fiere": [
      "Sagra","Fiera / Festival","Enogastronomia","Festa patronale",
      "Festa della birra","Festa del vino","Festa di partito/movimento politico"
    ],
    "Mercatini": [
      "Antiquariato","Hobbisti / Handmade","Usato / Vintage",
      "Km0 / Prodotti locali","Mercatino di Natale"
    ]
  },

  // Ordine preferito delle categorie in UI (coerente con la tua modale)
  EB_CATEGORIES_ORDER: [
    "Musica","Food & Drink","Nightlife","Cultura/Spettacolo",
    "Famiglie & Bambini","Sport","Sagre & Fiere","Mercatini"
  ]
};

// (opzionale) alias per eventuale codice vecchio
window.SQ = window.SQ || window.SQ_CONFIG;
