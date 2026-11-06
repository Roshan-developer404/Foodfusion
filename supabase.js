import { createClient } from '@supabase/supabase-js';

// BEFORE: <script src="cdn.jsdelivr.net/.../supabase-js"> + a global `foodFusionSupabase`
// NOW:    installed with npm and imported only where it is needed.
//
// Values come from a .env file (see .env.example). The fallback keeps the project
// working out of the box with your existing Supabase project.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://sbuznhhojbpyhvfhfkll.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wD2-EB1LJW85trTpUjvhLw_1mNc_aj9';

export const supabase = createClient(url, key);
