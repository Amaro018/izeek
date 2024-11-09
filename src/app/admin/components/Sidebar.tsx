import Link from "next/link"

export default function Sidebar() {
  return (
    <div className="flex flex-col gap-4 p-4 w-48 bg-orange-200 h-48 border border-black rounded-lg">
      <Link href="/admin/products">
        <h1 className="text-lg font-bold">Products</h1>
      </Link>
      <Link href="/admin/categories">
        <h1 className="text-lg font-bold">Categories</h1>
      </Link>

      <Link href="/admin/profile">
        <h1 className="text-lg font-bold">Profile</h1>
      </Link>
    </div>
  )
}
