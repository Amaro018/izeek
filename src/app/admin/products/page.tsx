"use client"
import { Box, Modal } from "@mui/material"
import { useState } from "react"
import ProductForm from "../components/ProductForm"
import ProductList from "../components/ProductList"

const style = {
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
export default function ProductPage() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
    console.log("open")
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <div className="w-full flex flex-col">
      <div className="bg-orange-200 p-4 rounded-t-lg flex flex-row items-center justify-between w-full">
        <h1 className="text-4xl font-bold text-white">Products</h1>
        <button
          className="bg-green-500 px-4 py-2 text-2xl text-white font-bold rounded-md hover:bg-green-600 transition-colors duration-300"
          onClick={handleOpen}
        >
          + Add Product
        </button>
      </div>
      <div>
        <ProductList />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2 z-10">
            <ProductForm />
          </div>
        </Box>
      </Modal>
    </div>
  )
}
