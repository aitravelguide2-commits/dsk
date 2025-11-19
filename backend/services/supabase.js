import { createClient } from '@supabase/supabase-js'

let client
export const getSupabase = () => {
  if (!client) {
    const url = process.env.SUPABASE_PROJECT_URL
    const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVIDE_ROLE
    client = createClient(url, key)
  }
  return client
}
export default getSupabase