"use client"
import { AuthClientPlugin } from "@blitzjs/auth"
import { setupBlitzClient } from "@blitzjs/next"
import { BlitzRpcPlugin } from "@blitzjs/rpc"
import { authConfig } from "./blitz-auth-config"

export const { withBlitz, BlitzProvider } = setupBlitzClient({
  plugins: [
    AuthClientPlugin(authConfig),
    // Disable suspense globally so client queries don't create SSR Suspense
    // boundaries (which were erroring → React #419 / full client re-render).
    // Data can be undefined on first render — components guard for it.
    BlitzRpcPlugin({
      reactQueryOptions: {
        queries: {
          suspense: false,
          staleTime: 60_000,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    }),
  ],
})
