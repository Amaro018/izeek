import Link from "next/link"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

type Crumb = { label: string; href?: string }

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm mb-6" aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <span key={idx} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className="text-orange-500 hover:text-orange-600 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-gray-700 font-semibold" : "text-gray-500"}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRightIcon style={{ fontSize: 16 }} className="text-gray-400" />}
          </span>
        )
      })}
    </nav>
  )
}
