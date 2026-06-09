import React from "react"
import Link from "next/link"
import { useAuthenticatedBlitzContext, invoke } from "../blitz-server"
import "../styles/globals.css"
import Sidebar from "./components/Sidebar"
import { LogoutButton } from "../(auth)/components/LogoutButton"
import getCurrentUser from "../users/queries/getCurrentUser"

export const metadata = {
  title: "Admin — i-Zeek",
}

// Admin pages depend on the authenticated session and Blitz RPC, so they
// must be rendered dynamically (never statically prerendered at build time).
export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectTo: "/login",
    role: ["ADMIN"],
    redirectAuthenticatedTo: "/",
  })

  const currentUser = await invoke(getCurrentUser, null)
  const displayName = currentUser?.name || currentUser?.email || "User"
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("")

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-end gap-3">
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 rounded-full hover:bg-gray-50 pl-3 pr-1 py-1 transition-colors"
          title="Edit profile"
        >
          <div className="flex flex-col items-end leading-tight">
            <span className="font-semibold text-gray-800 text-sm">{displayName}</span>
            <span className="text-xs text-orange-500 uppercase tracking-wide">
              {currentUser?.role?.toLowerCase() ?? ""}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center">
            {initials}
          </div>
        </Link>
        {/* Sidebar hides logout on mobile, so expose it here */}
        <div className="lg:hidden">
          <LogoutButton />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 sm:p-6 max-w-screen-xl mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
