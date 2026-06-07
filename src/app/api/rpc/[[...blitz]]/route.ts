import { rpcAppHandler } from "@blitzjs/rpc"
import { withBlitzAuth } from "src/app/blitz-server"

// @ts-expect-error @blitzjs/rpc 2.1.3 uses Next.js 14 handler types; Next.js 15 requires params: Promise<T>
export const { GET, HEAD, POST } = withBlitzAuth(rpcAppHandler())
