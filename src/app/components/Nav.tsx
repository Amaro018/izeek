import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { LogoutButton } from "./../(auth)/components/LogoutButton"
import { Box } from "@mui/material"

export default function Nav(props: any) {
  const currentUser = props.currentUser

  return (
    <nav className="flex flex-row justify-between py-8 px-16 bg-orange-200 items-center">
      <div className="flex flex-row items-center gap-4">
        <Box
          component="img"
          sx={{
            height: 50,
            width: 50,
          }}
          alt="iZeek Logo"
          src="/izeek.png"
        />
        <h1 className="text-4xl font-bold">i-Zeek</h1>
      </div>
      <ul className="flex flex-row gap-4">
        <li className="hover:underline">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:underline">
          <Link href={"/products"}>Products</Link>
        </li>
        <li className="hover:underline">
          <Link href="/contact">Contact</Link>
        </li>

        <li>
          {currentUser ? (
            <div className="flex flex-row gap-4  font-bold">
              <Link href="/admin/dashboard">Dashboard</Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex flex-row gap-4  font-bold">
              <Link href="/login">Login</Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  )
}
