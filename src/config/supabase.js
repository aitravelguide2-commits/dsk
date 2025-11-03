import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://hgttnevlpcewtpotwkvc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndHRuZXZscGNld3Rwb3R3a3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODY3NzIsImV4cCI6MjA3Nzc2Mjc3Mn0.YxjJbvmIi_v-VYrjmwUpa75JQYyTvsLEdZAgPlvKfjo'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role key for server-side operations (use with caution)
export const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndHRuZXZscGNld3Rwb3R3a3ZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE4Njc3MiwiZXhwIjoyMDc3NzYyNzcyfQ.zXMqDUbqA5fznGNUbglXPaMGJTiDnsg--Z5FB1wTizA'

// Secret key for backend operations
export const supabaseSecretKey = 'sb_secret_RkftjCOSjo4TJ5VQ_SP3vg_b3o-5Eqi'

export default supabase