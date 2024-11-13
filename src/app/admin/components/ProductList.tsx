import { useState } from "react"
import * as React from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import getProducts from "../../queries/getProducts" // Adjust the import path as necessary
import getCategories from "../queries/getCategories" // Adjust the import path as necessary
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
  Modal,
  Box,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import ProductForm from "./ProductForm"

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

const styleNew = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
}

const ProductList: FC = () => {
  const [deleteProductMutation] = useMutation(deleteProduct)
  const [products, { refetch }] = useQuery(getProducts, { skip: 0, take: 10 })
  const [categories] = useQuery(getCategories, {}) // Fetch categories
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("default")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleEdit = (product) => {
    setSelectedProduct(product) // Set the selected product for editing
    setOpenEdit(true)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
    setSelectedProduct(null) // Clear the selected product after closing the modal
  }

  const handleProductAdded = () => {
    setOpenEdit(false)
    setSelectedProduct(null)
    Swal.fire({
      title: "Success!",
      text: "The product has been added or updated successfully.",
      icon: "success",
      confirmButtonText: "OK",
    })
    refetch() // Refetch the products list to include the update
  }

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || product.category.id === parseInt(selectedCategory)
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortOption === "srpAsc") return a.srp - b.srp
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
        await refetch()
      }
    } catch (error) {
      Swal.fire("Error!", "An error occurred while deleting the product.", "error")
    }
  }

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
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
              display: "flex",
              flexDirection: "column",
              alignItems: "justify-between",
            }}
          >
            <CardHeader
              title={product.productName}
              subheader={product.category.name}
              action={
                <>
                  <IconButton aria-label="settings" onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleEdit(product)
                        handleMenuClose()
                      }}
                    >
                      <EditIcon fontSize="small" style={{ marginRight: 8 }} /> Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDelete(product.id)
                        handleMenuClose()
                      }}
                    >
                      <DeleteIcon fontSize="small" style={{ marginRight: 8 }} /> Delete
                    </MenuItem>
                  </Menu>
                </>
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
                Quantity: {product.quantity}
              </Typography>
              <Typography color="text.secondary">SRP: {product.srp}</Typography>
              <Typography color="text.secondary">SDP: {product.sdp}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleNew}>
          <ProductForm product={selectedProduct} onProductAdded={handleProductAdded} />
        </Box>
      </Modal>
    </div>
  )
}

export default ProductList
