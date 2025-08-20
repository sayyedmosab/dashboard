/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase Configuration
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  
  // Gemini API Configuration
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_DASHBOARD_GEMINI_API_KEY: string
  
  // Dashboard Module Configuration
  readonly VITE_DASHBOARD_DEFAULT_ORG_ID: string
  readonly VITE_DASHBOARD_DEFAULT_TIME_PERIOD: string
  readonly VITE_DASHBOARD_REFRESH_INTERVAL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}