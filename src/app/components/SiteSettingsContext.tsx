"use client"
import { createContext, useContext } from "react"
import { SITE_DEFAULTS } from "../queries/getSiteSettings"

export type SiteSettings = typeof SITE_DEFAULTS

const SiteSettingsContext = createContext<SiteSettings>(SITE_DEFAULTS)

// Settings are fetched once server-side in the root layout and passed down here.
// Reading them from context (instead of a client useQuery) means the value is
// already present at SSR, so there is no post-mount refetch and no flicker.
export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings
  children: React.ReactNode
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
