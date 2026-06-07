"use client"
import { useState } from "react"
import Link from "next/link"
import { useMutation } from "@blitzjs/rpc"
import forgotPassword from "../mutations/forgotPassword"
import { ForgotPassword } from "../validations"

export function ForgotPasswordForm() {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await forgotPasswordMutation(ForgotPassword.parse({ email }))
    } catch {
      setError("Sorry, we had an unexpected error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-6 text-white text-center">
            <h1 className="text-2xl font-extrabold">Forgot password?</h1>
            <p className="text-orange-100 text-sm mt-1">
              We&apos;ll email you a reset link.
            </p>
          </div>

          <div className="px-8 py-8">
            {isSuccess ? (
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Request submitted</h2>
                <p className="text-sm text-gray-500">
                  If your email is in our system, you&apos;ll receive instructions to reset your
                  password shortly.
                </p>
                <Link
                  href="/login"
                  className="inline-block mt-6 text-sm text-orange-500 hover:underline font-semibold"
                >
                  ← Back to login
                </Link>
              </div>
            ) : (
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

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  {loading ? "Sending…" : "Send reset instructions"}
                </button>

                <Link
                  href="/login"
                  className="text-center text-sm text-orange-500 hover:underline"
                >
                  ← Back to login
                </Link>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
