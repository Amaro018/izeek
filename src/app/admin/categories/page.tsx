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
import Swal from "sweetalert2"

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

  const [category, setCategory] = useState<any>(null)
  const [name, setName] = useState<string>("")

  const [categories, { isLoading, isError, refetch }] = useQuery(getCategories, {})

  const handleOpenAdd = () => {
    setIsEditMode(false) // Open in add mode
    setSelectedCategory(null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    console.log(category ? "may category" : "walang cateory")
    if (category) {
      const res = await updateCategoryMutation({ id: category.id, name })
      if (res) {
        setOpen(false)
        Swal.fire({
          title: "Updated!",
          text: "The category has been Updated.",
          icon: "success",
          customClass: {
            popup: "swal-high-index",
          },
        })
      }
      // else swal err
    } else {
      const res = await createCategoryMutation({ name })
      if (res) {
        setOpen(false)
        Swal.fire({
          title: "Created!",
          text: "The category has been created.",
          icon: "success",
          customClass: {
            popup: "swal-high-index",
          },
        })
      }
      // else swal err
    }
    refetch()
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
              isEditMode={isEditMode}
              setCategory={setCategory}
              inputName={{ name, setName }}
            />
          </div>
        </Box>
      </Modal>
      <CategoryList isEditMode={{ isEditMode, setIsEditMode }} handleModal={{ open, setOpen }} categories={{ categories, isLoading, isError, refetch }} setCategory={setCategory} inputName={{ name, setName }} onSubmit={handleSubmit} />
    </div>
  )
}

export default CategoryPage
