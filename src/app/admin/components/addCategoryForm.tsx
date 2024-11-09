// pages/admin/createCategory.tsx (or another page/component)

import { useMutation } from "@blitzjs/rpc"
import createCategory from "app/categories/mutations/createCategory"
import { useState } from "react"

export default function CreateCategoryForm() {
  const [name, setName] = useState("")
  const [createCategoryMutation] = useMutation(createCategory)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      // Call the mutation
      const category = await createCategoryMutation({ name })
      alert(`Category "${category.name}" created successfully!`)
      setName("") // Reset form field
    } catch (err) {
      setError("An error occurred while creating the category.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Category Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
        />
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Create Category</button>
    </form>
  )
}
