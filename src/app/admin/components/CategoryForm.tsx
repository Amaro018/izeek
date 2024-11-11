import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import createCategory from "../mutations/createCategory"
import updateCategory from "../../mutations/updateCategory"
import { TextField } from "@mui/material"
import getCategories from "../queries/getCategories"

const CategoryForm = ({ initialValues, isEditMode, category, onSubmit, setCategory, inputName }: { initialValues?: any, isEditMode?: boolean, category?: any, onSubmit?: any, setCategory?: any, inputName?: { name: string, setName: any } }) => {
  const router = useRouter()
  const [createCategoryMutation] = useMutation(createCategory)
  const [updateCategoryMutation] = useMutation(updateCategory)
  const [categories, { refetch }] = useQuery(getCategories, {})

  useEffect(() => {
    setCategory(category)
  }, [category, setCategory])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 z">
      <div>
        <p className="text-2xl text-center mb-4">{isEditMode ? "Update Category" : "Create Category"}</p>
      </div>
      <TextField
        label="Category Name"
        variant="outlined"
        value={inputName?.name}
        onChange={(e: any) => inputName?.setName(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        {category ? "Update" : "Create"}
      </button>
    </form>
  )
}

export default CategoryForm
