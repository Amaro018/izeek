"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { TextField } from "@mui/material"
import Swal from "sweetalert2"
import getSiteSettings from "../../queries/getSiteSettings"
import updateSiteSettings from "../mutations/updateSiteSettings"
import Breadcrumb from "../components/Breadcrumb"

export default function SiteSettingsPage() {
  const router = useRouter()
  const [settings, { refetch }] = useQuery(getSiteSettings, null)
  const [updateMutation, { isLoading }] = useMutation(updateSiteSettings)

  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [facebook, setFacebook] = useState("")

  useEffect(() => {
    if (settings) {
      setPhone(settings.phone || "")
      setEmail(settings.email || "")
      setAddress(settings.address || "")
      setFacebook(settings.facebook || "")
    }
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMutation({ phone, email, address, facebook })
      await refetch()
      router.refresh() // update public pages/footer
      Swal.fire("Saved!", "Contact info has been updated.", "success")
    } catch (err: any) {
      Swal.fire("Error", err?.message || "Could not save settings.", "error")
    }
  }

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Site Info" }]}
      />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Business Contact Info</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Shown on the public homepage. Changes apply site-wide.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 w-full"
      >
        <TextField
          label="Phone number"
          color="warning"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          color="warning"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Address"
          color="warning"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
        <TextField
          label="Facebook link"
          color="warning"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          fullWidth
          helperText="Full URL, e.g. https://m.me/yourpage"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="self-start bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
        >
          {isLoading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  )
}
