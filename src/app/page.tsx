import Link from "next/link"
import { invoke } from "./blitz-server"
import { LogoutButton } from "./(auth)/components/LogoutButton"
import styles from "./styles/Home.module.css"
import getCurrentUser from "./users/queries/getCurrentUser"
import Nav from "./components/Nav"
import getProducts from "./queries/getProducts"
import FacebookIcon from "@mui/icons-material/Facebook"
import HomeIcon from "@mui/icons-material/Home"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"

export default async function Home() {
  const currentUser = await invoke(getCurrentUser, null)
  const products = await invoke(getProducts, { skip: 0, take: 10 })

  return (
    <>
      <Nav currentUser={currentUser} />
      <div className="flex flex-col gap-4 text-2xl text-center p-16">
        <h1 className="text-4xl font-bold">Welcome to i-Zeek Data Solution and Network Services</h1>
        <p>
          Welcome to i-Zeek Network and Solution Services, where we prioritize quality, reliability,
          and expertise. We provide a comprehensive range of services designed to meet the diverse
          needs of our clients. From top-tier CCTV installation and monitoring to extensive software
          and hardware solutions, we offer robust support to keep your systems running smoothly and
          securely.
        </p>
        <p>
          Our services also extend to construction materials and services, where we supply and
          support high-quality materials that ensure durability and efficiency in every project. We
          specialize in automation systems tailored to simplify and enhance your operations, making
          us a trusted partner for innovation and growth.
        </p>
        <p>
          In addition, we provide a wide array of supplies for offices, schools, and various other
          industries, covering essentials that support daily functionality and productivity. At
          i-Zeek, we’re dedicated to delivering solutions that empower your work and safeguard your
          environment.
        </p>

        <div>
          <p className="text-2xl font-bold uppercase">Products</p>
          <div className="grid grid-cols-5 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded-md shadow-md">
                <h2 className="font-bold">{product.productName}</h2>
                <img src={product.productImage} alt="" className="w-48 h-48 m-auto" />
                <p>{product.productDescription}</p>
                <p className="text-lg font-semibold">Php {product.srp}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 p-8 border-t">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p>
            If you have any questions or need further assistance, please feel free to reach out to
            us:
          </p>
          <p className="mt-2">
            <strong>
              {" "}
              <PhoneIcon /> Phone:
            </strong>{" "}
            +123 456 7890
            <br />
            <strong>
              {" "}
              <EmailIcon /> Email:
            </strong>{" "}
            izeek.nsds@gmail.com
            <br />
            <strong className="">
              <HomeIcon />
              Address:
            </strong>{" "}
            San Rafael, Santo Domingo, Albay
          </p>
          <p className="mt-4">
            Message us on our social media channel for inquiries and questions:
          </p>
          <div className="flex justify-center gap-4 mt-4 items-center">
            <Link href="https://m.me/394695987071761" target="_blank" className="text-blue-600">
              <FacebookIcon />
              Facebook
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
