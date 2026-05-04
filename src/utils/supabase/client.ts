import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // During static prerendering (e.g. /_not-found) env vars may not be
    // available. Return null so callers can handle the missing-client case
    // gracefully instead of throwing and breaking the build.
    return null as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
