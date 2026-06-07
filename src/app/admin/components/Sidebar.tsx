"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "../../(auth)/components/LogoutButton"
import DashboardIcon from "@mui/icons-material/Dashboard"
import InventoryIcon from "@mui/icons-material/Inventory"
import CategoryIcon from "@mui/icons-material/Category"
import StoreIcon from "@mui/icons-material/Store"
import PersonIcon from "@mui/icons-material/Person"
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"
import EmailIcon from "@mui/icons-material/Email"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
  { href: "/admin/products", label: "Products", icon: <InventoryIcon fontSize="small" /> },
  { href: "/admin/categories", label: "Categories", icon: <CategoryIcon fontSize="small" /> },
  { href: "/admin/settings", label: "Site Info", icon: <ContactPhoneIcon fontSize="small" /> },
  { href: "/admin/email", label: "Email", icon: <EmailIcon fontSize="small" /> },
  { href: "/admin/profile", label: "Profile", icon: <PersonIcon fontSize="small" /> },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-56 bg-white border border-gray-200 rounded-2xl shadow-sm h-fit sticky top-6">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <StoreIcon className="text-orange-500" />
        <span className="font-bold text-gray-700 text-sm">Admin Panel</span>
      </div>

      <div className="flex flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {icon}
              {label}
            </Link>
          )
        })}
      </div>

      <div className="mt-auto p-3 border-t border-gray-100">
        <LogoutButton />
      </div>
    </div>
  )
}
