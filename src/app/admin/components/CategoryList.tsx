"use client"
import { useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import deleteCategory from "../../mutations/deleteCategory"
import Swal from "sweetalert2"
import { Box, Modal } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CategoryForm from "./CategoryForm"

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
}

export default function CategoryList({
  isEditMode,
  handleModal,
  categories,
  setCategory,
  inputName,
  onSubmit,
}: {
  isEditMode: { isEditMode: boolean; setIsEditMode: any }
  handleModal?: { open: boolean; setOpen: any }
  categories?: { categories: any; isLoading: any; isError: any; refetch: any }
  setCategory?: any
  inputName?: { name: string; setName: any }
  onSubmit?: any
}) {
  const [deleteCategoryMutation] = useMutation(deleteCategory)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const handleDelete = async (id: string, name: string, productCount: number) => {
    if (productCount > 0) {
      Swal.fire(
        "Cannot delete",
        `"${name}" still has ${productCount} product(s). Move or delete them first.`,
        "warning"
      )
      return
    }
    const result = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This category has no products and will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    })
    if (result.isConfirmed) {
      try {
        await deleteCategoryMutation({ id })
        Swal.fire("Deleted!", "The category has been deleted.", "success")
        await categories?.refetch()
      } catch (err: any) {
        Swal.fire("Error!", err?.message || "Failed to delete category.", "error")
      }
    }
  }

  const handleUpdate = (category: any) => {
    setSelectedCategory(category)
    inputName?.setName(category.name)
    isEditMode?.setIsEditMode(true)
    handleModal?.setOpen(true)
  }

  const handleClose = () => {
    handleModal?.setOpen(false)
    setSelectedCategory(null)
  }

  const list = categories?.categories ?? []

  return (
    <div className="w-full">
      {list.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl">No categories yet.</p>
          <p className="text-sm mt-1">Add your first category above.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-b-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-center font-semibold">Products</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-left font-semibold">Updated</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((category: any, idx: number) => (
                <tr
                  key={category.id}
                  className={`border-t border-gray-100 hover:bg-orange-50 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-gray-800 capitalize">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block bg-orange-100 text-orange-700 font-semibold text-xs px-2.5 py-1 rounded-full">
                      {category._count?.products ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(category.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleUpdate(category)}
                        className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-3 py-1.5 rounded-lg transition-colors text-xs"
                      >
                        <EditIcon style={{ fontSize: 14 }} />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(category.id, category.name, category._count?.products ?? 0)
                        }
                        className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-lg transition-colors text-xs"
                      >
                        <DeleteIcon style={{ fontSize: 14 }} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            {list.length} categor{list.length === 1 ? "y" : "ies"}
          </div>
        </div>
      )}

      <Modal open={handleModal?.open ?? false} onClose={handleClose}>
        <Box sx={modalStyle}>
          <CategoryForm
            isEditMode={isEditMode?.isEditMode}
            category={selectedCategory}
            setCategory={setCategory}
            inputName={inputName}
            onSubmit={onSubmit}
          />
        </Box>
      </Modal>
    </div>
  )
}
