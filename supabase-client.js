
const SUPABASE_URL = 'https://sbuznhhojbpyhvfhfkll.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_wD2-EB1LJW85trTpUjvhLw_1mNc_aj9';

/* if the Supabase library could not load (offline, ad blocker), leave this undefined so
   script.js can show a clear message instead of crashing */
const foodFusionSupabase = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : undefined;
