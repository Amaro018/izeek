import React from "react"
import { useAuthenticatedBlitzContext } from "../blitz-server"
import "../styles/globals.css"
import Sidebar from "./components/Sidebar"
import Nav from "./../components/Nav"

export const metadata = {
  title: "Admin",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectTo: "/login",
    role: ["ADMIN"],
    redirectAuthenticatedTo: "/",
  })
  return (
    <>
      <Nav />
      <div className="flex flex-row p-16 gap-16">
        <Sidebar />
        {children}
      </div>
    </>
  )
}
