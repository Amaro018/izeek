"use client"
import Sidebar from "../components/Sidebar"

import * as React from "react"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
}

const CategoryPage = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  // Only authenticated users can access this page

  return (
    <div className="w-full flex flex-col">
      <div className="bg-orange-200 p-4 rounded-t-lg flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Categories</h1>
        <button
          className="bg-green-400 px-4 py-2 text-2xl text-white rounded-md"
          onClick={handleOpen}
        >
          + Add Category
        </button>
      </div>
      <div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-r-2 border-b-2">Name</th>
              <th className="p-2 border-r-2 border-b-2">Created At</th>
              <th className="p-2 border-r-2 border-b-2">Updated At</th>
              <th className="p-2 border-b-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b-2">
              <td className="p-2">Shoes</td>
              <td className="p-2">
                <button className="bg-yellow-400 px-4 py-2 text-2xl text-white rounded-md mr-2">
                  Edit
                </button>
                <button className="bg-red-400 px-4 py-2 text-2xl text-white rounded-md">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryPage
