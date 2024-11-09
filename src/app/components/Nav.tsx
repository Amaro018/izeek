import Link from "next/link"
import { invoke } from "./../blitz-server"
import { LogoutButton } from "./../(auth)/components/LogoutButton"
// import styles from "./styles/Home.module.css"
import getCurrentUser from "./../users/queries/getCurrentUser"

export default async function Nav() {
  const currentUser = await invoke(getCurrentUser, null)

  return (
    <nav className="flex flex-row justify-between py-8 px-16 bg-orange-200 items-center">
      <div className="flex flex-row items-center gap-4">
        <img src="/izeek.png" alt="logo" className="w-12 h-12" />
        <h1 className="text-4xl font-bold">i-Zeek</h1>
      </div>
      <ul className="flex flex-row gap-4">
        <li className="hover:underline">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:underline">
          <Link href="/about">About</Link>
        </li>
        <li className="hover:underline">Products</li>

        <div>
          {currentUser ? (
            <>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <strong>Login</strong>
              </Link>
            </>
          )}
        </div>
      </ul>
    </nav>
  )
}
