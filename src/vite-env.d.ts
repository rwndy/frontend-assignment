/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_DETAILS_URL: string
  readonly VITE_API_DEPARTMENTS_URL: string
  readonly VITE_API_LOCATIONS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}