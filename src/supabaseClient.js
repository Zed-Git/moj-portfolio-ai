import { createClient } from '@supabase/supabase-js'

// Uzimamo tajne ključeve iz .env fajla
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Pravimo klijenta koji će pričati sa bazom
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
