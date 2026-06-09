const { withBlitz } = require("@blitzjs/next")

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // sodium-native (via secure-password) ships a native .node binary loaded by
  // node-gyp-build at runtime. Bundling it with webpack breaks prebuild lookup
  // ("No native build was found"). Keep it external so Next traces the full
  // package into .next/standalone/node_modules instead.
  serverExternalPackages: ["secure-password", "sodium-native"],
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = withBlitz(nextConfig)
