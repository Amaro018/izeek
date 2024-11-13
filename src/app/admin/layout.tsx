import React from "react"
import { invoke, useAuthenticatedBlitzContext } from "../blitz-server"
import "../styles/globals.css"
import Sidebar from "./components/Sidebar"
import Nav from "./../components/Nav"
import { cookies } from "next/headers" // Import async cookies
import getCurrentUser from "../users/queries/getCurrentUser"

export const metadata = {
  title: "Admin",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Fetch cookies asynchronously

  // Ensure asynchronous handling for useAuthenticatedBlitzContext
  await useAuthenticatedBlitzContext({
    redirectTo: "/login",
    role: ["ADMIN"],
    redirectAuthenticatedTo: "/",
  })

  return (
    <>
      {/* <Nav currentUser={currentUser ? currentUser : null} /> */}
      <div className="flex flex-row p-16 gap-16">
        <Sidebar />
        <main className="w-full">{children}</main>
      </div>
    </>
  )
}
