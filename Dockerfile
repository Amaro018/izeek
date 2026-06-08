# Stage 1: Install dependencies
FROM node:20-alpine AS deps
# python3/make/g++ are needed to build native deps (sodium-native via secure-password)
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
ENV HUSKY=0
COPY package*.json ./
# legacy-peer-deps matches the project's .npmrc (Blitz has peer-dep conflicts otherwise)
RUN npm install --legacy-peer-deps

# Stage 2: Build the application
FROM node:20-alpine AS builder
# openssl + libc6-compat: Prisma query AND schema engines (db push) need libssl
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
ENV HUSKY=0
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment (no secrets — the build does not connect to the DB)
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client, then build Blitz/Next (produces .next/standalone)
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Prisma's query engine needs libssl (openssl 3) + libc6-compat at runtime
RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/db ./db
# Overlay the full node_modules AFTER the standalone copy. Next's standalone
# tracer drops native .node binaries — notably sodium-native (used by
# @blitzjs/auth's SecurePassword) — which segfaults the process on login.
# Copying the real, musl-compiled node_modules (incl. .prisma + sodium-native)
# fixes the crash.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Writable uploads dir for product images
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
