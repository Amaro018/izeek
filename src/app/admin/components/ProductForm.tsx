"use client"
import { FC, useState, useEffect } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@blitzjs/rpc"
import createProduct from "../../mutations/createProduct"
import updateProduct from "../../mutations/updateProduct"
import getCategories from "../queries/getCategories"
import { MenuItem, TextField, CircularProgress } from "@mui/material"
import Swal from "sweetalert2"
import uploadProductImage from "../../mutations/uploadProductImage"

interface ProductFormProps {
  product?: any
  onProductAdded: () => void
}

const ProductForm: FC<ProductFormProps> = ({ product, onProductAdded }) => {
  const [createProductMutation, { isLoading: isCreating }] = useMutation(createProduct)
  const [updateProductMutation, { isLoading: isUpdating }] = useMutation(updateProduct)

  const [productName, setProductName] = useState<string>("")
  const [productDescription, setProductDescription] = useState<string>("")
  const [quantity, setQuantity] = useState<number | "">(1)
  const [srp, setSrp] = useState<number | "">("")
  const [sdp, setSdp] = useState<number | "">("")
  const [categoryId, setCategoryId] = useState<string | "">("")
  const [productImage, setProductImage] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const [categories] = useQuery(getCategories, {}, { suspense: true })

  // Pre-fill fields if editing an existing product
  useEffect(() => {
    if (product) {
      setProductName(product.productName || "")
      setProductDescription(product.productDescription || "")
      setQuantity(product.quantity || 1)
      setSrp(product.srp || "")
      setSdp(product.sdp || "")
      setCategoryId(product.categoryId || "")
      setImageUrl(product.productImage || "")
    }
  }, [product])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        setProductImage(base64String)

        try {
          const fileUrl = await uploadProductImage({
            fileName: file.name,
            data: base64String,
          })
          const uniqueFileName = `${Date.now()}-${fileUrl}`
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

    if (!categoryId) {
      Swal.fire("Category required", "Please select a category for this product.", "warning")
      return
    }

    const productData = {
      productName,
      productDescription,
      quantity: quantity as number,
      srp: srp as number,
      sdp: sdp as number,
      categoryId: categoryId as string,
      productImage: imageUrl,
    }

    try {
      if (product) {
        // Update existing product
        await updateProductMutation({ id: product.id, ...productData })
        Swal.fire("Updated!", "Product updated successfully.", "success")
      } else {
        // Create a new product
        await createProductMutation(productData)
        Swal.fire("Created!", "Product created successfully.", "success")
      }
      onProductAdded()
    } catch (error) {
      Swal.fire("Error", "An error occurred while saving the product.", "error")
      console.error(error)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-bold mb-2">No categories available</p>
        <p className="text-sm text-gray-500">
          You must create at least one category before adding a product.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below. Fields marked * are required.
        </p>
      </div>

      {/* Basic info */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500">Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Product Name *"
            variant="outlined"
            color="warning"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            select
            label="Category *"
            color="warning"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as string)}
            required
            fullWidth
          >
            {categories.map((category: any) => (
              <MenuItem key={category.id} value={category.id} className="capitalize">
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <TextField
          label="Description *"
          color="warning"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          multiline
          minRows={3}
          maxRows={6}
          required
          fullWidth
        />
      </section>

      {/* Pricing & stock */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Pricing & Stock
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            label="Quantity"
            variant="outlined"
            color="warning"
            value={quantity}
            type="number"
            onChange={(e) => setQuantity(Number(e.target.value) || "")}
            fullWidth
          />
          <TextField
            label="SRP (₱)"
            variant="outlined"
            color="warning"
            value={srp}
            type="number"
            onChange={(e) => setSrp(parseFloat(e.target.value) || "")}
            fullWidth
          />
          <TextField
            label="SDP (₱)"
            variant="outlined"
            color="warning"
            value={sdp}
            type="number"
            onChange={(e) => setSdp(parseFloat(e.target.value) || "")}
            fullWidth
          />
        </div>
      </section>

      {/* Image */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-orange-500">Product Image</h3>
        <div className="flex items-center gap-5">
          <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
            {isUploading ? (
              <CircularProgress size={28} color="warning" />
            ) : imageUrl ? (
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-gray-400 text-center px-2">No image</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="productImage"
              className="cursor-pointer inline-block bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-sm px-4 py-2 rounded-lg transition-colors w-fit"
            >
              {imageUrl ? "Change image" : "Upload image"}
            </label>
            <input
              id="productImage"
              type="file"
              name="productImage"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-gray-400">PNG, JPG, GIF, WEBP — max 5 MB.</p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </Link>
        <button
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
          type="submit"
          disabled={isCreating || isUpdating || isUploading}
        >
          {isCreating ? "Creating…" : isUpdating ? "Updating…" : product ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
