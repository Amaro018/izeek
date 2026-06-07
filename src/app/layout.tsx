import "./styles/globals.css"
import { BlitzProvider } from "./blitz-client"
import { Inter } from "next/font/google"
import Nav from "./components/Nav"
import Footer from "./components/Footer"
import { CartProvider } from "./components/CartContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: { title: "i-Zeek", template: "%s – i-Zeek" },
  description: "i-Zeek Data Solution and Network Services",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BlitzProvider>
          <CartProvider>
            <Nav />
            {children}
            <Footer />
          </CartProvider>
        </BlitzProvider>
      </body>
    </html>
  )
}
