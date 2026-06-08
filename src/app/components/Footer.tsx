"use client"
import { useSiteSettings } from "./SiteSettingsContext"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import FacebookIcon from "@mui/icons-material/Facebook"

export default function Footer() {
  const site = useSiteSettings()

  return (
    <footer className="w-full border-t bg-white print:hidden">
      <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col items-center gap-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-gray-600">
          {site?.phone && (
            <span className="flex items-center gap-2">
              <PhoneIcon className="text-orange-500" fontSize="small" />
              {site.phone}
            </span>
          )}
          {site?.email && (
            <span className="flex items-center gap-2">
              <EmailIcon className="text-orange-500" fontSize="small" />
              {site.email}
            </span>
          )}
          {site?.address && (
            <span className="flex items-center gap-2">
              <LocationOnIcon className="text-orange-500" fontSize="small" />
              {site.address}
            </span>
          )}
          {site?.facebook && (
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FacebookIcon className="text-orange-500" fontSize="small" />
              Facebook
            </a>
          )}
        </div>
        <p className="text-xs text-gray-500 text-center">
          Copyright &copy; {new Date().getFullYear()} Izeek. All rights reserved - made by Jhomari
          Amaro
        </p>
      </div>
    </footer>
  )
}
