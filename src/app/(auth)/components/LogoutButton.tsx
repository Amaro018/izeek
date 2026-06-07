"use client"
import logout from "../mutations/logout"
import { useRouter } from "next/navigation"
import { useMutation } from "@blitzjs/rpc"
import LogoutIcon from "@mui/icons-material/Logout"

export function LogoutButton() {
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  return (
    <button
      onClick={async () => {
        await logoutMutation()
        router.push("/login")
        router.refresh()
      }}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
    >
      <LogoutIcon fontSize="small" />
      Logout
    </button>
  )
}
