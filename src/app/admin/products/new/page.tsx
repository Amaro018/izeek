"use client"
import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { CircularProgress } from "@mui/material"
import ProductForm from "../../components/ProductForm"
import Breadcrumb from "../../components/Breadcrumb"

export default function NewProductPage() {
  const router = useRouter()

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Products", href: "/admin/products" },
          { label: "Add New" },
        ]}
      />

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm w-full">
        <Suspense fallback={<CircularProgress />}>
          <ProductForm onProductAdded={() => router.push("/admin/products")} />
        </Suspense>
      </div>
    </div>
  )
}
