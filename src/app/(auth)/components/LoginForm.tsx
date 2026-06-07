"use client"
import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import login from "../mutations/login"
import { Login } from "../validations"
import { useMutation, useQuery } from "@blitzjs/rpc"
import getSiteSettings from "../../queries/getSiteSettings"
import { useSearchParams, useRouter } from "next/navigation"
import type { Route } from "next"
import { useState } from "react"
import Image from "next/image"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation, { isLoading }] = useMutation(login)
  const router = useRouter()
  const next = useSearchParams()?.get("next")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [site] = useQuery(getSiteSettings, null, { suspense: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await loginMutation(Login.parse({ email, password }))
      router.refresh()
      router.push(next ? (next as Route) : "/admin/dashboard")
    } catch (err: any) {
      if (err instanceof AuthenticationError) {
        setError("Invalid email or password.")
      } else if (err?.message?.includes("Too many login attempts")) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          {/* Header band */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-6 text-white text-center">
            <div className="flex justify-center mb-3">
              <Image src="/izeek.png" alt="i-Zeek" width={52} height={52} className="rounded-xl" />
            </div>
            <h1 className="text-2xl font-extrabold">Admin Login</h1>
            <p className="text-orange-100 text-sm mt-1">i-Zeek Data Solution & Network Services</p>
          </div>

          {/* Form body */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoFocus
                  className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-xs text-orange-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm transition"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-xl transition-colors text-sm mt-1"
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          {[site?.address, site?.email].filter(Boolean).join(" · ")}
        </p>
      </div>
    </div>
  )
}
