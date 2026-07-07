/* ===================================================
   MyCampus ISTQB — Supabase Configuration
   ===================================================
   Reemplaza estos valores con los de tu proyecto:
   Supabase Dashboard → Settings → API
   =================================================== */

const SUPABASE_URL  = 'https://lksgfimyijkrvqxainuj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrc2dmaW15aWprcnZxeGFpbnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNDE5NzUsImV4cCI6MjA5MTgxNzk3NX0._1FclfNgOrOxtDD0YaH3Xcq4a7EQm6cOFQWbNQwwadU';

// DSN de Sentry (monitoreo de errores). Es público por diseño, misma
// categoría que la anon key de arriba: sentry.io/settings → Projects → Client Keys.
const SENTRY_DSN = 'https://bd59c56d12263542a880500dc7212a2f@o4511694488272896.ingest.de.sentry.io/4511694507016272';
