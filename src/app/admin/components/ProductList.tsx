import { useState } from "react"
import * as React from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import getProducts from "../../queries/getProducts" // Adjust the import path as necessary
import getCategories from "../queries/getCategories" // Adjust the import path as necessary
import deleteProduct from "../../mutations/deleteProduct"
import Swal from "sweetalert2"
import { FC } from "react"
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Collapse,
  Avatar,
  CardMedia,
  Button,
  Chip,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

interface Product {
  id: number
  productName: string
  productDescription: string
  quantity: number
  srp: number
  sdp: number
  productImage?: string
  category: {
    id: number
    name: string
  }
}

const style = {
  height: "100px",
  width: "100px",
  margin: "auto",
}

const ProductList: FC = () => {
  const [deleteProductMutation] = useMutation(deleteProduct)
  const [products, { refetch }] = useQuery(getProducts, { skip: 0, take: 10 })
  const [categories] = useQuery(getCategories, {}) // Fetch categories
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("default")
  const [selectedCategory, setSelectedCategory] = useState("all") // New state for category filter

  // Filter and sort the products
  const filteredAndSortedProducts = products
    .filter((product) => {
      // Filter by search term and selected category
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || product.category.id === parseInt(selectedCategory)
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortOption === "srpAsc") {
        return a.srp - b.srp
      }
      return 0
    })

  const handleDelete = async (productId: number) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      })

      if (result.isConfirmed) {
        await deleteProductMutation({ id: productId })
        Swal.fire("Deleted!", "The product has been deleted.", "success")
      }
      await refetch()
    } catch (error) {
      Swal.fire("Error!", "An error occurred while deleting the product.", "error")
    }
  }

  return (
    <div>
      <div className="flex flex-row gap-4 mt-8">
        {/* Search Field */}
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        {/* Sort Dropdown */}
        <TextField
          select
          label="Sort by"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          sx={{ marginBottom: 2 }}
          fullWidth
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="srpAsc">Price: Low to High</MenuItem>
        </TextField>

        {/* Category Filter */}
        <TextField
          select
          label="Filter by Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ marginBottom: 4 }}
          fullWidth
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id.toString()}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="flex flex-row mt-8 gap-4 flex-wrap justify-evenly">
        {filteredAndSortedProducts.map((product) => (
          <Card
            key={product.id}
            sx={{
              width: 250,
              display: "flex flex-column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardHeader
              title={product.productName}
              subheader={product.category.name}
              action={
                <IconButton aria-label="settings" onClick={() => handleDelete(product.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            />
            <CardMedia
              component="img"
              sx={style}
              image={product.productImage || ""}
              alt={product.productName}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {product.productDescription}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity : {product.quantity}
              </Typography>
              <div className="flex flex-row gap-4 justify-between">
                <Typography variant="h6" color="text.secondary">
                  SRP : {product.srp}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  SDP : {product.sdp}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProductList
