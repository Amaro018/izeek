import Link from "next/link"
import { invoke } from "./blitz-server"
import { LogoutButton } from "./(auth)/components/LogoutButton"
import styles from "./styles/Home.module.css"
import getCurrentUser from "./users/queries/getCurrentUser"
import Nav from "./components/Nav"
export default async function Home() {
  const currentUser = await invoke(getCurrentUser, null)
  return (
    <>
      <Nav />
    </>
  )
}
