"use client"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import getProducts from "./queries/getProducts"
import { useCart } from "./components/CartContext"
import Swal from "sweetalert2"
import SecurityIcon from "@mui/icons-material/Security"
import ComputerIcon from "@mui/icons-material/Computer"
import BuildIcon from "@mui/icons-material/Build"
import SettingsIcon from "@mui/icons-material/Settings"
import StorefrontIcon from "@mui/icons-material/Storefront"

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

const services = [
  {
    icon: <SecurityIcon style={{ fontSize: 40 }} className="text-orange-500" />,
    title: "CCTV Installation",
    desc: "Professional CCTV installation and 24/7 monitoring solutions.",
  },
  {
    icon: <ComputerIcon style={{ fontSize: 40 }} className="text-orange-500" />,
    title: "Software & Hardware",
    desc: "Complete software and hardware support to keep your systems running.",
  },
  {
    icon: <BuildIcon style={{ fontSize: 40 }} className="text-orange-500" />,
    title: "Construction Materials",
    desc: "High-quality materials for durable and efficient construction projects.",
  },
  {
    icon: <SettingsIcon style={{ fontSize: 40 }} className="text-orange-500" />,
    title: "Automation Systems",
    desc: "Tailored automation systems to simplify and enhance your operations.",
  },
  {
    icon: <StorefrontIcon style={{ fontSize: 40 }} className="text-orange-500" />,
    title: "Office & School Supplies",
    desc: "Wide array of supplies covering office, school, and industry essentials.",
  },
]

export default function Home() {
  const [products] = useQuery(getProducts, { skip: 0, take: 8 }, { suspense: false })
  const { addItem } = useCart()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 px-8 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
          i-Zeek Data Solution
          <br />
          <span className="text-orange-500">& Network Services</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Quality, reliability, and expertise — delivering comprehensive solutions for CCTV,
          software, hardware, construction, automation, and supplies.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/products"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow"
          >
            View Products
          </Link>
          <Link
            href="/contact"
            className="border border-orange-400 hover:bg-orange-50 text-orange-600 font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-8 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Our Services</h2>
        <p className="text-center text-gray-500 mb-10">Everything you need, under one roof.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {services.map((s) => (
            <div
              key={s.title}
              className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              {s.icon}
              <h3 className="font-bold mt-3 text-gray-800">{s.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {(products?.length ?? 0) > 0 && (
        <section className="py-16 px-8 bg-gray-50">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Featured Products</h2>
          <p className="text-center text-gray-500 mb-10">Browse our latest offerings.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <img
                  src={product.productImage || "/izeek.png"}
                  alt={product.productName}
                  className="w-full h-40 object-contain rounded-lg mb-3"
                />
                <h3 className="font-bold text-gray-800 text-sm">{product.productName}</h3>
                <p className="text-xs text-gray-500 mt-1 flex-1 line-clamp-2">
                  {product.productDescription}
                </p>
                <p className="text-orange-500 font-bold mt-2">
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
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="text-orange-500 font-semibold hover:underline text-lg"
            >
              View all products →
            </Link>
          </div>
        </section>
      )}

    </div>
  )
}
