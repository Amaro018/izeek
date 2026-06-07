"use client"
import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { TextField, MenuItem } from "@mui/material"
import Swal from "sweetalert2"
import getEmailSettings from "../queries/getEmailSettings"
import updateEmailSettings from "../mutations/updateEmailSettings"
import sendTestEmail from "../mutations/sendTestEmail"
import Breadcrumb from "../components/Breadcrumb"

export default function EmailSettingsPage() {
  const [settings, { refetch }] = useQuery(getEmailSettings, null)
  const [updateMutation, { isLoading }] = useMutation(updateEmailSettings)
  const [testMutation, { isLoading: testing }] = useMutation(sendTestEmail)

  const [host, setHost] = useState("")
  const [port, setPort] = useState(587)
  const [secure, setSecure] = useState(false)
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [fromName, setFromName] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [contactTo, setContactTo] = useState("")

  useEffect(() => {
    if (settings) {
      setHost(settings.host)
      setPort(settings.port)
      setSecure(settings.secure)
      setUser(settings.user)
      setPass(settings.pass)
      setFromName(settings.fromName)
      setFromEmail(settings.fromEmail)
      setContactTo(settings.contactTo)
    }
  }, [settings])

  const save = async () => {
    await updateMutation({ host, port, secure, user, pass, fromName, fromEmail, contactTo })
    await refetch()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await save()
      Swal.fire("Saved!", "Email settings updated.", "success")
    } catch (err: any) {
      Swal.fire("Error", err?.message || "Could not save.", "error")
    }
  }

  const handleTest = async () => {
    const { value: to } = await Swal.fire({
      title: "Send test email to:",
      input: "email",
      inputValue: contactTo || fromEmail,
      showCancelButton: true,
      confirmButtonText: "Send",
    })
    if (!to) return
    try {
      await save() // persist current values first so the test uses them
      await testMutation({ to })
      Swal.fire("Sent!", `Test email sent to ${to}.`, "success")
    } catch (err: any) {
      Swal.fire("Failed", err?.message || "Could not send test email.", "error")
    }
  }

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Email" }]}
      />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Email (SMTP)</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Used for the contact form and password resets. For Gmail, use an{" "}
        <span className="font-semibold">App Password</span> (not your normal password).
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4 w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            label="SMTP Host"
            color="warning"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="smtp.gmail.com"
            fullWidth
          />
          <TextField
            label="Port"
            type="number"
            color="warning"
            value={port}
            onChange={(e) => setPort(Number(e.target.value) || 587)}
            fullWidth
          />
          <TextField
            select
            label="Encryption"
            color="warning"
            value={secure ? "ssl" : "tls"}
            onChange={(e) => setSecure(e.target.value === "ssl")}
            fullWidth
          >
            <MenuItem value="tls">STARTTLS (587)</MenuItem>
            <MenuItem value="ssl">SSL (465)</MenuItem>
          </TextField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="SMTP Username"
            color="warning"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            fullWidth
          />
          <TextField
            label="SMTP Password / App Password"
            type="password"
            color="warning"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            fullWidth
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="From Name"
            color="warning"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            placeholder="i-Zeek"
            fullWidth
          />
          <TextField
            label="From Email"
            type="email"
            color="warning"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            fullWidth
          />
        </div>

        <TextField
          label="Contact form recipient"
          type="email"
          color="warning"
          value={contactTo}
          onChange={(e) => setContactTo(e.target.value)}
          helperText="Where visitor messages are delivered. Defaults to From Email."
          fullWidth
        />

        <div className="flex items-center gap-3 mt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            {isLoading ? "Saving…" : "Save settings"}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            {testing ? "Sending…" : "Send test email"}
          </button>
        </div>
      </form>
    </div>
  )
}
