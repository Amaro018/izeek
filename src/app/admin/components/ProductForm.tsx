"use client"
import { FC, useState, useEffect } from "react"

import { useMutation, useQuery } from "@blitzjs/rpc"
import createProduct from "../../mutations/createProduct"
import getCategories from "../queries/getCategories"
import { MenuItem, TextField, CircularProgress } from "@mui/material"
import Swal from "sweetalert2"

interface ProductFormProps {
  product?: any
}

const ProductForm: FC<ProductFormProps> = ({ product }) => {
  const [createProductMutation, { isLoading }] = useMutation(createProduct)
  const [productName, setProductName] = useState<string>("")
  const [productDescription, setProductDescription] = useState<string>("")
  const [quantity, setQuantity] = useState<number | "">(1)
  const [srp, setSrp] = useState<number | "">("")
  const [sdp, setSdp] = useState<number | "">("")
  const [categoryId, setCategoryId] = useState<number | "">("")
  const [productImage, setProductImage] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  // Fetch categories with useQuery
  const [categories] = useQuery(getCategories, {}, { suspense: true })

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProductImage(base64String) // Set productImage as a base64 string
        setImageUrl(base64String)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Prepare the data for the mutation
      const newProduct = {
        productName,
        productDescription,
        quantity: quantity as number,
        srp: srp as number,
        sdp: sdp as number,
        categoryId: categoryId as number,
        productImage, // base64 string
      }

      // Call the mutation
      await createProductMutation(newProduct)

      // Display success alert
      Swal.fire({
        title: "Created!",
        text: "The product has been created.",
        icon: "success",
        customClass: {
          popup: "swal-high-index",
        },
      })
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while creating the product.",
        icon: "error",
      })
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-lg font-bold mb-4 text-center">Adding New Product</p>

      <TextField
        label="Product Name"
        variant="outlined"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        required
      />

      <TextField
        label="Description"
        value={productDescription}
        onChange={(e) => setProductDescription(e.target.value)}
        multiline
        maxRows={4}
        required
      />

      <TextField
        label="Quantity"
        variant="outlined"
        value={quantity}
        type="number"
        onChange={(e) => setQuantity(Number(e.target.value) || "")}
      />

      <TextField
        label="Srp"
        variant="outlined"
        value={srp}
        type="number"
        onChange={(e) => setSrp(parseFloat(e.target.value) || "")}
      />

      <TextField
        label="Sdp"
        variant="outlined"
        value={sdp}
        type="number"
        onChange={(e) => setSdp(parseFloat(e.target.value) || "")}
      />

      <TextField
        select
        label="Select Category"
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        helperText="Please select a category"
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>

      <label htmlFor="productImage">Product Image</label>
      <input
        id="productImage"
        type="file"
        name="productImage"
        accept="image/*"
        onChange={handleFileChange}
      />
      {isUploading && <CircularProgress />}
      {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create"}
      </button>
    </form>
  )
}

export default ProductForm
