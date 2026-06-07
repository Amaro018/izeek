"use client"
import { Suspense } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQuery } from "@blitzjs/rpc"
import { CircularProgress } from "@mui/material"
import getProduct from "../../../queries/getProduct"
import ProductForm from "../../../components/ProductForm"
import Breadcrumb from "../../../components/Breadcrumb"

function EditProductForm({ id }: { id: string }) {
  const router = useRouter()
  const [product] = useQuery(getProduct, { id })
  return <ProductForm product={product} onProductAdded={() => router.push("/admin/products")} />
}

export default function EditProductPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Products", href: "/admin/products" },
          { label: "Edit" },
        ]}
      />

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm w-full">
        <Suspense fallback={<CircularProgress />}>
          <EditProductForm id={id} />
        </Suspense>
      </div>
    </div>
  )
}
