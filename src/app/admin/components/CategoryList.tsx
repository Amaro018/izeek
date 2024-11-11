import Link from "next/link"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getCategories from "./../queries/getCategories"
import deleteCategory from "../../mutations/deleteCategory"
import Swal from "sweetalert2"
import { useState } from "react"
import { Box, Modal } from "@mui/material"
import CategoryForm from "./CategoryForm"

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

export default function CategoryList() {
  const [categories, { isLoading, isError, refetch }] = useQuery(getCategories, {})
  const [deleteCategoryMutation] = useMutation(deleteCategory)

  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading categories.</p>

  // Function to handle deletion with confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })

    if (result.isConfirmed) {
      await deleteCategoryMutation({ id })
      refetch()
      Swal.fire("Deleted!", "The category has been deleted.", "success")
    }
  }

  const handleUpdate = (category) => {
    setSelectedCategory(category)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedCategory(null)
  }

  return (
    <div className="w-full">
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
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="p-2 border-b-2 text-center font-bold">
                {category.name.toUpperCase()}
              </td>
              <td className="p-2 border-b-2 text-center">
                {new Date(category.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className="p-2 border-b-2 text-center">
                {new Date(category.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className="p-2 border-b-2 flex flex-row gap-4 justify-center">
                <button
                  onClick={() => handleUpdate(category)}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <CategoryForm category={selectedCategory} />
        </Box>
      </Modal>
    </div>
  )
}
