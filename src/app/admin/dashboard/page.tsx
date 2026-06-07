"use client"
import { useQuery } from "@blitzjs/rpc"
import getStats from "../queries/getStats"
import Link from "next/link"
import InventoryIcon from "@mui/icons-material/Inventory"
import CategoryIcon from "@mui/icons-material/Category"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import PaidIcon from "@mui/icons-material/Paid"

export default function AdminDashboard() {
  const [stats] = useQuery(getStats, {})

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
          <div className="bg-orange-100 p-4 rounded-full">
            <InventoryIcon className="text-orange-500" style={{ fontSize: 40 }} />
          </div>
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Total Products</p>
            <p className="text-5xl font-bold text-orange-600">{stats.productCount}</p>
            <Link
              href="/admin/products"
              className="text-sm text-orange-400 hover:text-orange-600 hover:underline mt-1 inline-block"
            >
              Manage Products →
            </Link>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <CategoryIcon className="text-blue-500" style={{ fontSize: 40 }} />
          </div>
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Total Categories</p>
            <p className="text-5xl font-bold text-blue-600">{stats.categoryCount}</p>
            <Link
              href="/admin/categories"
              className="text-sm text-blue-400 hover:text-blue-600 hover:underline mt-1 inline-block"
            >
              Manage Categories →
            </Link>
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
          <div className="bg-green-100 p-4 rounded-full">
            <PaidIcon className="text-green-600" style={{ fontSize: 40 }} />
          </div>
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Inventory Value (SRP)</p>
            <p className="text-4xl font-bold text-green-600">
              ₱{stats.inventoryValue.toLocaleString()}
            </p>
          </div>
        </div>

        <div
          className={`bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-6 ${
            stats.lowStockCount > 0 ? "border-red-200" : "border-gray-200"
          }`}
        >
          <div
            className={`p-4 rounded-full ${
              stats.lowStockCount > 0 ? "bg-red-100" : "bg-gray-100"
            }`}
          >
            <WarningAmberIcon
              className={stats.lowStockCount > 0 ? "text-red-500" : "text-gray-400"}
              style={{ fontSize: 40 }}
            />
          </div>
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Low Stock (≤5)</p>
            <p
              className={`text-5xl font-bold ${
                stats.lowStockCount > 0 ? "text-red-600" : "text-gray-400"
              }`}
            >
              {stats.lowStockCount}
            </p>
            <Link
              href="/admin/products"
              className="text-sm text-gray-400 hover:text-gray-600 hover:underline mt-1 inline-block"
            >
              Review products →
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            <AddCircleOutlineIcon fontSize="small" />
            Add Product
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            <AddCircleOutlineIcon fontSize="small" />
            Add Category
          </Link>
        </div>
      </div>
    </div>
  )
}
