import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import createCategory from "../mutations/createCategory"
import updateCategory from "../../mutations/updateCategory"
import { TextField } from "@mui/material"
import Swal from "sweetalert2"
import getCategories from "../queries/getCategories"

const CategoryForm = ({ category }) => {
  const router = useRouter()
  const [createCategoryMutation] = useMutation(createCategory)
  const [updateCategoryMutation] = useMutation(updateCategory)
  const [categories, { refetch }] = useQuery(getCategories, {})

  const [name, setName] = useState(category?.name || "")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (category) {
      await updateCategoryMutation({ id: category.id, name })
      Swal.fire({
        title: "Updated!",
        text: "The category has been Updated.",
        icon: "success",
        customClass: {
          popup: "swal-high-index",
        },
      })
    } else {
      await createCategoryMutation({ name })
      Swal.fire({
        title: "Created!",
        text: "The category has been created.",
        icon: "success",
        customClass: {
          popup: "swal-high-index",
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 z">
      <div>
        <p className="text-2xl text-center mb-4">Adding a category</p>
      </div>
      <TextField
        label="Category Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
