"use client"
import { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import getProducts from "../queries/getProducts"
import getCategories from "../admin/queries/getCategories"
import { useCart } from "../components/CartContext"
import Swal from "sweetalert2"

const cartToast = (name: string) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `${name} added to cart`,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  })

export default function ProductsPage() {
  const { addItem } = useCart()
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("all")

  const [categoriesData] = useQuery(getCategories, {}, { suspense: false })
  const categories = categoriesData ?? []
  // Server-side search + category filter (debounce-free; Blitz caches per key).
  const [productsData] = useQuery(
    getProducts,
    {
      skip: 0,
      take: 100,
      search: search || undefined,
      categoryId,
    },
    { suspense: false }
  )
  const products = productsData ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 sm:py-12 px-4 sm:px-8 text-center text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Our Products</h1>
        <p className="mt-2 text-orange-100">Browse our complete catalog</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:flex-1 px-4 py-2 rounded-xl text-gray-800 outline-none shadow"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-gray-800 outline-none shadow"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="py-8 sm:py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        {products.length === 0 ? (
          <p className="text-center text-gray-400 text-lg py-16">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
              >
                <img
                  src={product.productImage || "/izeek.png"}
                  alt={product.productName}
                  className="w-full h-40 object-contain p-2"
                />
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-xs text-orange-400 font-semibold uppercase mb-1">
                    {product.category.name}
                  </span>
                  <h2 className="font-bold text-gray-800 text-sm leading-tight">
                    {product.productName}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 flex-1 line-clamp-2">
                    {product.productDescription}
                  </p>
                  <p className="text-orange-500 font-bold mt-3">
                    ₱{product.srp.toLocaleString()}
                  </p>
                  <button
                    onClick={() => {
                      addItem({
                        id: product.id,
                        productName: product.productName,
                        srp: product.srp,
                        productImage: product.productImage,
                      })
                      cartToast(product.productName)
                    }}
                    className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-center text-sm text-gray-400 mt-8">{products.length} product(s)</p>
      </div>
    </div>
  )
}
