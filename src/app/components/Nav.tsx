"use client"
import Link from "next/link"
import Image from "next/image"
import { useQuery } from "@blitzjs/rpc"
import getCurrentUser from "../users/queries/getCurrentUser"
import { LogoutButton } from "./../(auth)/components/LogoutButton"
import { useCart } from "./CartContext"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function Nav() {
  // Fetch the session client-side so the root layout can stay static
  // (reading cookies server-side forces dynamic rendering / DYNAMIC_SERVER_USAGE).
  const [currentUser] = useQuery(getCurrentUser, null, { suspense: false })
  const { count } = useCart()

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm print:hidden">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Image src="/izeek.png" alt="i-Zeek Logo" width={40} height={40} />
        <span className="text-2xl font-extrabold text-orange-500">i-Zeek</span>
      </Link>

      <ul className="flex items-center gap-6 text-gray-700 font-medium">
        <li>
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link href="/products" className="hover:text-orange-500 transition-colors">
            Products
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-orange-500 transition-colors">
            Contact
          </Link>
        </li>
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
    </nav>
  )
}
