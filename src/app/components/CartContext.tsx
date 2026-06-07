"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export type CartItem = {
  id: string
  productName: string
  srp: number
  productImage?: string | null
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void
  setQuantity: (id: string, qty: number) => void
  removeItem: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | null>(null)
const STORAGE_KEY = "izeek-canvas"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true)
  }, [])

  // Persist on change (after initial load).
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, loaded])

  const addItem: CartContextType["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i))
      }
      return [...prev, { ...item, quantity: qty }]
    })
  }

  const setQuantity: CartContextType["setQuantity"] = (id, qty) => {
    // Clamp to a minimum of 1; removal is done explicitly via removeItem.
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)))
  }

  const removeItem: CartContextType["removeItem"] = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id))

  const clear = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + i.srp * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, total, addItem, setQuantity, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
