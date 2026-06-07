"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { TextField } from "@mui/material"
import Swal from "sweetalert2"
import getCurrentUser from "../../users/queries/getCurrentUser"
import updateProfile from "../mutations/updateProfile"
import changePassword from "../../(auth)/mutations/changePassword"
import Breadcrumb from "../components/Breadcrumb"

export default function ProfilePage() {
  const router = useRouter()
  const [user, { refetch }] = useQuery(getCurrentUser, null)
  const [updateProfileMutation, { isLoading: savingProfile }] = useMutation(updateProfile)
  const [changePasswordMutation, { isLoading: savingPassword }] = useMutation(changePassword)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfileMutation({ name, email })
      await refetch()
      router.refresh() // update header avatar/name
      Swal.fire("Saved!", "Your profile has been updated.", "success")
    } catch (err: any) {
      Swal.fire("Error", err?.message || "Could not update profile.", "error")
    }
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await changePasswordMutation({ currentPassword, newPassword })
      setCurrentPassword("")
      setNewPassword("")
      Swal.fire("Done!", "Your password has been changed.", "success")
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.message || "Could not change password. Check your current password.",
        "error"
      )
    }
  }

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Profile" }]}
      />

      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        {/* Account details */}
        <form
          onSubmit={handleProfile}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
        >
          <h2 className="text-lg font-semibold text-gray-700">Account Details</h2>
          <TextField
            label="Name"
            color="warning"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email *"
            type="email"
            color="warning"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <p className="text-xs text-gray-400">
            Role: <span className="uppercase font-semibold text-orange-500">{user?.role}</span>
          </p>
          <button
            type="submit"
            disabled={savingProfile}
            className="self-start bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            {savingProfile ? "Saving…" : "Save changes"}
          </button>
        </form>

        {/* Password */}
        <form
          onSubmit={handlePassword}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
        >
          <h2 className="text-lg font-semibold text-gray-700">Change Password</h2>
          <TextField
            label="Current password"
            type="password"
            color="warning"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="New password"
            type="password"
            color="warning"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            fullWidth
            helperText="At least 10 characters."
          />
          <button
            type="submit"
            disabled={savingPassword}
            className="self-start bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            {savingPassword ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  )
}
