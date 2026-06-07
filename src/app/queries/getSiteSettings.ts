import db from "db"

// Fallback values used until an admin saves custom contact info.
export const SITE_DEFAULTS = {
  phone: "+123 456 7890",
  email: "izeek.nsds@gmail.com",
  address: "San Rafael, Santo Domingo, Albay",
  facebook: "https://m.me/394695987071761",
}

export default async function getSiteSettings() {
  const s = await db.siteSettings.findUnique({ where: { id: "default" } })
  return {
    phone: s?.phone ?? SITE_DEFAULTS.phone,
    email: s?.email ?? SITE_DEFAULTS.email,
    address: s?.address ?? SITE_DEFAULTS.address,
    facebook: s?.facebook ?? SITE_DEFAULTS.facebook,
  }
}
