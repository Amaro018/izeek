import React from "react"
import Swal from "sweetalert2"

interface SwalModalProps {
  title: string
  message: string
  icon: "success" | "error" | "warning" | "info" | "question"
  onClose?: () => void // Callback to trigger when the modal closes
}

const SwalModal: React.FC<SwalModalProps> = ({ title, message, icon, onClose }) => {
  // Show SweetAlert modal when the component is mounted
  React.useEffect(() => {
    const showModal = async () => {
      await Swal.fire({
        title,
        text: message,
        icon,
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-high-index", // You can customize this class for styling if necessary
        },
      })
      if (onClose) onClose() // Execute the callback after the modal closes
    }

    showModal()
  }, [title, message, icon, onClose])

  return null // This component doesn't render anything to the DOM, it triggers the Swal modal
}

export default SwalModal
