"use client"
import Modal from "@mui/material/Modal"
import * as React from "react"
import Box from "@mui/material/Box"
import CategoryForm from "../components/CategoryForm"
import { useState } from "react"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getCategories from "../queries/getCategories" // Ensure this is the correct path
import CategoryList from "../components/CategoryList"
import createCategory from "../mutations/createCategory"
import updateCategory from "../../mutations/updateCategory" // Import update mutation

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
  const [open, setOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false) // Track whether form is in edit mode
  const [selectedCategory, setSelectedCategory] = useState(null) // Track the selected category for editing

  const [createCategoryMutation] = useMutation(createCategory)
  const [updateCategoryMutation] = useMutation(updateCategory)

  const handleOpenAdd = () => {
    setIsEditMode(false) // Open in add mode
    setSelectedCategory(null)
    setOpen(true)
  }

  const handleOpenEdit = (category) => {
    setIsEditMode(true) // Open in edit mode
    setSelectedCategory(category)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleSubmit = async (categoryData) => {
    try {
      if (isEditMode) {
        await updateCategoryMutation({ id: selectedCategory.id, ...categoryData })
      } else {
        await createCategoryMutation(categoryData)
      }
      handleClose()
    } catch (err) {
      console.error("An error occurred:", err)
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="bg-orange-200 p-4 rounded-t-lg flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Categories</h1>
        <button
          className="bg-green-400 px-4 py-2 text-2xl text-white rounded-md"
          onClick={handleOpenAdd}
        >
          + Add Category
        </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2">
            <CategoryForm
              initialValues={isEditMode ? selectedCategory : {}}
              onSubmit={handleSubmit}
              formTitle={isEditMode ? "Edit Category" : "Add Category"}
            />
          </div>
        </Box>
      </Modal>
      <CategoryList onEdit={handleOpenEdit} /> {/* Pass edit handler */}
    </div>
  )
}

export default CategoryPage
