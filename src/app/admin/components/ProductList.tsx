// components/ProductList.tsx
import * as React from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import getProducts from "../../queries/getProducts" // Adjust the import path as necessary
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

interface Product {
  id: number
  productName: string
  productDescription: string
  quantity: number
  srp: number
  sdp: number
  category: {
    id: number
    name: string
  }
}

const ProductList: FC = () => {
  const [deleteProductMutation] = useMutation(deleteProduct)
  const [products, { refetch }] = useQuery(getProducts, { skip: 0, take: 10 })
  const [open, setOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

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
        // Optionally, refresh or update your products list here
      }
      await refetch()
    } catch (error) {
      Swal.fire("Error!", "An error occurred while deleting the product.", "error")
    }
  }
  return (
    <div className="flex flex-row mt-8 gap-4 flex-wrap justify-evenly">
      {products.map((product) => (
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
                delete
              </IconButton>
            }
          />
          <div className="w-32 h-32 border border-black flex items-center justify-center">
            <CardMedia
              component="img"
              image={product.productImage || ""}
              alt={product.productName}
            />
          </div>

          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {product.productDescription}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quantity : {product.quantity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SRP : {product.srp}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SDP : {product.sdp}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ProductList
