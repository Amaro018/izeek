"use client"
import { useState } from "react"
import { BlitzPage } from "blitz"
import { useSiteSettings } from "../components/SiteSettingsContext"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import FacebookIcon from "@mui/icons-material/Facebook"

const ContactPage: BlitzPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const site = useSiteSettings()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await response.json()
      if (data.success) {
        alert("Message sent successfully")
        setName("")
        setEmail("")
        setMessage("")
      } else {
        alert(data.error || "Error sending message")
      }
    } catch (error) {
      console.error(error)
      alert("Error sending message")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-10 sm:py-12 px-4 sm:px-8 text-center text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Contact Us</h1>
        <p className="mt-2 text-orange-100">We&apos;d love to hear from you.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Contact info */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-gray-800">Get In Touch</h2>
          {site?.phone && (
            <div className="flex items-center gap-3 text-gray-600">
              <PhoneIcon className="text-orange-500" />
              <span>{site.phone}</span>
            </div>
          )}
          {site?.email && (
            <div className="flex items-center gap-3 text-gray-600">
              <EmailIcon className="text-orange-500" />
              <span>{site.email}</span>
            </div>
          )}
          {site?.address && (
            <div className="flex items-center gap-3 text-gray-600">
              <LocationOnIcon className="text-orange-500" />
              <span>{site.address}</span>
            </div>
          )}
          {site?.facebook && (
            <div className="flex items-center gap-3">
              <FacebookIcon className="text-orange-500" />
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Message us on Facebook
              </a>
            </div>
          )}
        </div>

        {/* Message form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700" htmlFor="message">
              Message
            </label>
            <textarea
              className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm min-h-[120px]"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="self-start bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
