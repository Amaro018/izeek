"use client"
import Link from "next/link"
import Image from "next/image"
import { useSiteSettings } from "../components/SiteSettingsContext"
import { useCart } from "../components/CartContext"
import Swal from "sweetalert2"
import DeleteIcon from "@mui/icons-material/Delete"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default function CanvasPage() {
  const { items, total, count, setQuantity, removeItem, clear } = useCart()
  const site = useSiteSettings()

  const buildMessage = () => {
    const lines = items.map(
      (i) => `- ${i.quantity}x ${i.productName} (₱${i.srp.toLocaleString()} each)`
    )
    return `Hi! I'd like to canvas the following items:\n\n${lines.join("\n")}\n\nEstimated total: ₱${total.toLocaleString()}`
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildMessage())
    Swal.fire("Copied!", "Your cart list was copied to clipboard.", "success")
  }

  const handleDownload = () => {
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const doc = new jsPDF()
    const peso = (n: number) => `PHP ${n.toLocaleString()}`

    // Letterhead
    doc.setFont("helvetica", "bold")
    doc.setFontSize(15)
    doc.setTextColor(234, 88, 12)
    doc.text("i-Zeek Data Solution & Network Services", 14, 18)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(107, 114, 128)
    let y = 24
    if (site?.address) {
      doc.text(site.address, 14, y)
      y += 4
    }
    const contact = [site?.phone, site?.email].filter(Boolean).join("  -  ")
    if (contact) {
      doc.text(contact, 14, y)
      y += 4
    }

    // Title (right)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor(234, 88, 12)
    doc.text("PRODUCT ESTIMATE", 196, 18, { align: "right" })
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(107, 114, 128)
    doc.text(dateStr, 196, 24, { align: "right" })

    // Divider
    doc.setDrawColor(249, 115, 22)
    doc.setLineWidth(0.8)
    doc.line(14, y + 2, 196, y + 2)

    autoTable(doc, {
      startY: y + 8,
      head: [["Product", "Qty", "SRP", "Subtotal"]],
      body: items.map((i) => [
        i.productName,
        String(i.quantity),
        peso(i.srp),
        peso(i.srp * i.quantity),
      ]),
      foot: [["", "", "Estimated Total", peso(total)]],
      theme: "grid",
      headStyles: { fillColor: [255, 247, 237], textColor: [154, 52, 18] },
      footStyles: { fillColor: [255, 255, 255], textColor: [31, 41, 55], fontStyle: "bold" },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
    })

    const finalY = (doc as any).lastAutoTable?.finalY ?? y + 20
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text(
      "* Estimate based on SRP. Final pricing may vary - contact us to confirm availability.",
      14,
      finalY + 8
    )

    doc.save(`izeek-estimate-${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  if (count === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add products to estimate a total.</p>
        <Link
          href="/products"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-8 sm:py-10 px-4 sm:px-8 text-center text-white print:hidden">
        <h1 className="text-3xl sm:text-4xl font-extrabold">My Cart</h1>
        <p className="mt-2 text-orange-100">Estimate the total for the products you want.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Print-only branded letterhead */}
        <div className="hidden print:block mb-6">
          <div className="flex items-start justify-between border-b-2 border-orange-500 pb-4">
            <div className="flex items-center gap-3">
              <Image src="/izeek.png" alt="i-Zeek" width={48} height={48} />
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">
                  i-Zeek Data Solution &amp; Network Services
                </h1>
                {site?.address && <p className="text-xs text-gray-600">{site.address}</p>}
                <p className="text-xs text-gray-600">
                  {[site?.phone, site?.email].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold tracking-wide text-orange-600">PRODUCT ESTIMATE</p>
              <p className="text-xs text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 border-b border-gray-100 last:border-b-0"
            >
              <img
                src={item.productImage || "/izeek.png"}
                alt={item.productName}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-lg border border-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-[45%]">
                <p className="font-semibold text-gray-800">{item.productName}</p>
                <p className="text-sm text-orange-500 font-bold">
                  ₱{item.srp.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.id, Number(e.target.value) || 1)}
                  className="w-14 text-center border border-gray-300 rounded-lg py-1.5 text-sm"
                />
                <button
                  onClick={() => setQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                >
                  +
                </button>
              </div>

              <div className="w-24 sm:w-28 text-right font-bold text-gray-800 ml-auto sm:ml-0">
                ₱{(item.srp * item.quantity).toLocaleString()}
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                title="Remove"
              >
                <DeleteIcon />
              </button>
            </div>
          ))}

          {/* Total */}
          <div className="flex items-center justify-between p-5 bg-gray-50">
            <span className="text-gray-600 font-medium">
              {count} item{count === 1 ? "" : "s"}
            </span>
            <span className="text-2xl font-extrabold text-gray-800">
              Total: ₱{total.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          * Estimate based on SRP. Final pricing may vary — contact us to confirm availability.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6 print:hidden">
          <button
            onClick={handleCopy}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Copy list
          </button>
          <button
            onClick={() => window.print()}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Print
          </button>
          <button
            onClick={handleDownload}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Download
          </button>
          {site?.email && (
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(
                "Product canvas inquiry"
              )}&body=${encodeURIComponent(buildMessage())}`}
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-5 py-2.5 rounded-lg transition-colors"
            >
              Email inquiry
            </a>
          )}
          {site?.facebook && (
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg transition-colors"
            >
              Message on Facebook
            </a>
          )}
          <button
            onClick={() =>
              Swal.fire({
                title: "Clear cart?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                confirmButtonText: "Yes, clear it",
              }).then((r) => r.isConfirmed && clear())
            }
            className="ml-auto text-red-500 hover:text-red-600 font-semibold px-3 py-2.5"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  )
}
