"use client"
import { useState } from "react"
import * as React from "react"
import Link from "next/link"
import { useMutation, useQuery } from "@blitzjs/rpc"
import getProducts from "../../queries/getProducts"
import getCategories from "../queries/getCategories"
import deleteProduct from "../../mutations/deleteProduct"
import Swal from "sweetalert2"
import { FC } from "react"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import EditIcon from "@mui/icons-material/Edit"
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  CardMedia,
  TextField,
  MenuItem,
  Menu,
  Chip,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"

const ProductList: FC = () => {
  const [deleteProductMutation] = useMutation(deleteProduct)
  const [productsData, { refetch }] = useQuery(getProducts, { skip: 0, take: 100 })
  const products = productsData ?? []
  const [categoriesData] = useQuery(getCategories, {})
  const categories = categoriesData ?? []
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("default")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, productId: string) => {
    setAnchorEl(event.currentTarget)
    setOpenMenuId(productId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setOpenMenuId(null)
  }

  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    })
    if (result.isConfirmed) {
      try {
        await deleteProductMutation({ id: productId })
        Swal.fire("Deleted!", "The product has been deleted.", "success")
        await refetch()
      } catch {
        Swal.fire("Error!", "An error occurred while deleting the product.", "error")
      }
    }
  }

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || product.category.id === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortOption === "srpAsc") return a.srp - b.srp
      if (sortOption === "srpDesc") return b.srp - a.srp
      if (sortOption === "nameAsc") return a.productName.localeCompare(b.productName)
      return 0
    })

  return (
    <div>
      <div className="bg-orange-500 p-4 sm:p-5 rounded-t-xl flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Products</h1>
        {categories.length === 0 ? (
          <button
            className="bg-white text-orange-500 font-bold px-5 py-2 rounded-lg opacity-50 cursor-not-allowed"
            onClick={() =>
              Swal.fire(
                "No categories",
                "You need to create a category before adding a product.",
                "warning"
              )
            }
          >
            + Add Product
          </button>
        ) : (
          <Link
            href="/admin/products/new"
            className="bg-white text-orange-500 font-bold px-5 py-2 rounded-lg hover:bg-orange-50 transition-colors"
          >
            + Add Product
          </Link>
        )}
      </div>

      {categories.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-xl mb-4">
          No categories yet. Create a category first — products must belong to a category.
        </div>
      )}

      <div className="bg-gray-50 p-4 border border-gray-200 rounded-b-xl mb-6">
        <div className="flex flex-row gap-3 flex-wrap">
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 2, minWidth: 180 }}
          />
          <TextField
            select
            label="Sort by"
            value={sortOption}
            size="small"
            onChange={(e) => setSortOption(e.target.value)}
            sx={{ flex: 1, minWidth: 150 }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="nameAsc">Name A–Z</MenuItem>
            <MenuItem value="srpAsc">Price: Low to High</MenuItem>
            <MenuItem value="srpDesc">Price: High to Low</MenuItem>
          </TextField>
          <TextField
            select
            label="Category"
            value={selectedCategory}
            size="small"
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ flex: 1, minWidth: 150 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <p className="text-sm text-gray-500 mt-2">{filteredProducts.length} product(s) found</p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl">No products found.</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              sx={{ display: "flex", flexDirection: "column", borderRadius: "12px" }}
              elevation={2}
            >
              <CardHeader
                title={
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {product.productName}
                  </Typography>
                }
                subheader={
                  <Chip label={product.category.name} size="small" sx={{ mt: 0.5 }} />
                }
                action={
                  <>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, product.id)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenuId === product.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        component={Link}
                        href={`/admin/products/${product.id}/edit`}
                        onClick={handleMenuClose}
                      >
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDelete(product.id)
                          handleMenuClose()
                        }}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                      </MenuItem>
                    </Menu>
                  </>
                }
                sx={{ pb: 0 }}
              />
              <CardMedia
                component="img"
                sx={{ height: 120, objectFit: "contain", p: 1 }}
                image={product.productImage || "/izeek.png"}
                alt={product.productName}
              />
              <CardContent sx={{ pt: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                  {product.productDescription}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Qty: {product.quantity}
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="warning.main">
                  SRP: ₱{product.srp.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  SDP: ₱{product.sdp.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  )
}

export default ProductList
