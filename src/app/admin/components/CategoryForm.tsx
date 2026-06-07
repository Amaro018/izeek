"use client"
import { useEffect } from "react"
import { TextField } from "@mui/material"

const CategoryForm = ({
  isEditMode,
  category,
  onSubmit,
  setCategory,
  inputName,
}: {
  isEditMode?: boolean
  category?: any
  onSubmit?: any
  setCategory?: any
  inputName?: { name: string; setName: any }
  initialValues?: any
}) => {
  useEffect(() => {
    setCategory?.(category)
  }, [category, setCategory])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <p className="text-xl font-bold text-center text-gray-800">
        {isEditMode ? "Update Category" : "Create Category"}
      </p>
      <TextField
        label="Category Name"
        variant="outlined"
        size="small"
        value={inputName?.name ?? ""}
        onChange={(e) => inputName?.setName(e.target.value)}
        required
        fullWidth
        autoFocus
      />
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-xl transition-colors"
        type="submit"
      >
        {isEditMode ? "Update Category" : "Create Category"}
      </button>
    </form>
  )
}

export default CategoryForm
