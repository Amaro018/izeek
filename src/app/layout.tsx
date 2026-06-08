import "./styles/globals.css"
import { BlitzProvider } from "./blitz-client"
import { Inter } from "next/font/google"
import Nav from "./components/Nav"
import Footer from "./components/Footer"
import { CartProvider } from "./components/CartContext"
import { SiteSettingsProvider } from "./components/SiteSettingsContext"
import ThemeRegistry from "./ThemeRegistry"
import { loadSiteSettings } from "./lib/loadSiteSettings"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: { title: "i-Zeek", template: "%s – i-Zeek" },
  description: "i-Zeek Data Solution and Network Services",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch contact/site settings once on the server so every consumer (footer,
  // contact, login, cart) gets the value at SSR — no client refetch, no flicker.
  const site = await loadSiteSettings()

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <BlitzProvider>
            <SiteSettingsProvider value={site}>
              <CartProvider>
                <Nav />
                {children}
                <Footer />
              </CartProvider>
            </SiteSettingsProvider>
          </BlitzProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
