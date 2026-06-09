"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useQuery } from "@blitzjs/rpc"
import getCurrentUser from "../users/queries/getCurrentUser"
import { LogoutButton } from "./../(auth)/components/LogoutButton"
import { useCart } from "./CartContext"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
]

export default function Nav() {
  // Fetch the session client-side so the root layout can stay static
  // (reading cookies server-side forces dynamic rendering / DYNAMIC_SERVER_USAGE).
  const [currentUser] = useQuery(getCurrentUser, null, { suspense: false })
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm print:hidden">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          onClick={() => setOpen(false)}
        >
          <Image src="/izeek.png" alt="i-Zeek Logo" width={36} height={36} />
          <span className="text-xl sm:text-2xl font-extrabold text-orange-500">i-Zeek</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-orange-500 transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/canvas"
              className="relative flex items-center hover:text-orange-500 transition-colors"
              title="My Cart"
            >
              <ShoppingCartIcon />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </li>
          {currentUser && (
            <li className="flex items-center gap-3">
              {currentUser.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Dashboard
                </Link>
              )}
              <LogoutButton />
            </li>
          )}
        </ul>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            href="/canvas"
            className="relative flex items-center text-gray-700"
            title="My Cart"
            onClick={() => setOpen(false)}
          >
            <ShoppingCartIcon />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-gray-700"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  active ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {l.label}
              </Link>
            )
          })}
          {currentUser?.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors text-center mt-1"
            >
              Dashboard
            </Link>
          )}
          {currentUser && (
            <div className="pt-1">
              <LogoutButton />
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
