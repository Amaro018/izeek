"use client"
import { FC, useState, useEffect } from "react"

import { useMutation, useQuery } from "@blitzjs/rpc"
import createProduct from "../../mutations/createProduct"
import getCategories from "../queries/getCategories"
import { MenuItem, TextField, CircularProgress } from "@mui/material"
import Swal from "sweetalert2"
import uploadProductImage from "../../mutations/uploadProductImage"
interface ProductFormProps {
  product?: any
  onProductAdded: () => void // New prop for success callback
}

const ProductForm: FC<ProductFormProps> = ({ product, onProductAdded }) => {
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

      reader.onloadend = async () => {
        const base64String = reader.result as string
        setProductImage(base64String) // Set productImage as a base64 string for preview

        // Upload the image to server
        try {
          const fileUrl = await uploadProductImage({
            fileName: file.name,
            data: base64String,
          })
          const uniqueFileName = `${Date.now()}-${fileUrl}`
          // Set the URL returned by the mutation
          setImageUrl(fileUrl)
        } catch (error) {
          console.error("Image upload failed:", error)
        } finally {
          setIsUploading(false)
        }
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
        productImage: imageUrl, // base64 string
      }

      // Call the mutation
      await createProductMutation(newProduct)
      onProductAdded()
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

      <div className="w-full flex flex-row gap-4">
        <TextField
          label="Product Name"
          variant="outlined"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          fullWidth
        />

        <TextField
          select
          label="Select Category"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          helperText="Please select a category"
          fullWidth
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <TextField
        label="Description"
        value={productDescription}
        onChange={(e) => setProductDescription(e.target.value)}
        multiline
        maxRows={4}
        required
      />
      <div className="w-full flex flex-row gap-4 mt-4">
        <TextField
          label="Quantity"
          variant="outlined"
          value={quantity}
          type="number"
          onChange={(e) => setQuantity(Number(e.target.value) || "")}
          fullWidth
        />

        <TextField
          label="Srp"
          variant="outlined"
          value={srp}
          type="number"
          onChange={(e) => setSrp(parseFloat(e.target.value) || "")}
          fullWidth
        />

        <TextField
          label="Sdp"
          variant="outlined"
          value={sdp}
          type="number"
          onChange={(e) => setSdp(parseFloat(e.target.value) || "")}
          fullWidth
        />
      </div>
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
