"use client"
import Modal from "@mui/material/Modal"
import * as React from "react"
import Box from "@mui/material/Box"
import CategoryForm from "../components/CategoryForm"
import { useState } from "react"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getCategories from "../queries/getCategories"
import CategoryList from "../components/CategoryList"
import createCategory from "../mutations/createCategory"
import updateCategory from "../../mutations/updateCategory"
import Swal from "sweetalert2"

const style = {
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

const CategoryPage = () => {
  const [open, setOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [createCategoryMutation] = useMutation(createCategory)
  const [updateCategoryMutation] = useMutation(updateCategory)
  const [category, setCategory] = useState<any>(null)
  const [name, setName] = useState<string>("")
  const [categories, { isLoading, isError, refetch }] = useQuery(getCategories, {})

  const handleOpenAdd = () => {
    setIsEditMode(false)
    setSelectedCategory(null)
    setCategory(null)
    setName("")
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setName("")
    setCategory(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (category) {
        await updateCategoryMutation({ id: category.id, name })
        Swal.fire({
          title: "Updated!",
          text: "The category has been updated.",
          icon: "success",
          customClass: { popup: "swal-high-index" },
        })
      } else {
        await createCategoryMutation({ name })
        Swal.fire({
          title: "Created!",
          text: "The category has been created.",
          icon: "success",
          customClass: { popup: "swal-high-index" },
        })
      }
      setOpen(false)
      setName("")
      setCategory(null)
      await refetch()
    } catch (err: any) {
      Swal.fire("Error", err.message || "Something went wrong.", "error")
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="bg-orange-500 p-5 rounded-t-xl flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <button
          className="bg-white text-orange-500 font-bold px-5 py-2 rounded-lg hover:bg-orange-50 transition-colors"
          onClick={handleOpenAdd}
        >
          + Add Category
        </button>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <CategoryForm
            initialValues={isEditMode ? selectedCategory : {}}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
            setCategory={setCategory}
            inputName={{ name, setName }}
          />
        </Box>
      </Modal>

      <CategoryList
        isEditMode={{ isEditMode, setIsEditMode }}
        handleModal={{ open, setOpen }}
        categories={{ categories, isLoading, isError, refetch }}
        setCategory={setCategory}
        inputName={{ name, setName }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default CategoryPage
