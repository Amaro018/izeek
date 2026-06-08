import db from "db"
import { SITE_DEFAULTS } from "../queries/getSiteSettings"

// Server-only reader for site settings. Used by the root layout (a server
// component). We hit Prisma directly instead of `invoke(getSiteSettings)`
// because Blitz's `invoke` -> `getBlitzContext` throws in the standalone
// production build ("supported only in next.js 13.0.0 and above").
export async function loadSiteSettings() {
  try {
    const s = await db.siteSettings.findUnique({ where: { id: "default" } })
    return {
      phone: s?.phone ?? SITE_DEFAULTS.phone,
      email: s?.email ?? SITE_DEFAULTS.email,
      address: s?.address ?? SITE_DEFAULTS.address,
      facebook: s?.facebook ?? SITE_DEFAULTS.facebook,
    }
  } catch {
    // DB unreachable (e.g. during the Docker build's prerender pass) — fall
    // back to defaults so the build doesn't crash.
    return { ...SITE_DEFAULTS }
  }
}
