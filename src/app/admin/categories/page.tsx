"use client"
import Sidebar from "../components/Sidebar"
import Modal from "@mui/material/Modal"
import * as React from "react"
import Box from "@mui/material/Box"
import addCategoryForm from "../components/addCategoryForm"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
}

const CategoryPage = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  // Only authenticated users can access this page

  return (
    <div className="w-full flex flex-col">
      <div className="bg-orange-200 p-4 rounded-t-lg flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold">Categories</h1>
        <button
          className="bg-green-400 px-4 py-2 text-2xl text-white rounded-md"
          onClick={handleOpen}
        >
          + Add Category
        </button>
      </div>

      {/* MODAL HERE */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-2">
            <addCategoryForm />
          </div>
        </Box>
      </Modal>

      <div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-r-2 border-b-2">Name</th>
              <th className="p-2 border-r-2 border-b-2">Created At</th>
              <th className="p-2 border-r-2 border-b-2">Updated At</th>
              <th className="p-2 border-b-2">Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryPage
