import { BlitzPage, useQuery } from "blitz"
import getProducts from "./../queries/getProducts"
import { invoke } from "../blitz-server"

const ProductsPage: BlitzPage = async () => {
  const products = await invoke(getProducts, { skip: 0, take: 10 })

  return (
    <div className="flex flex-col gap-4 p-16">
      <p className="text-2xl font-bold uppercase text-center">List of all Products</p>
      <div className="grid grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-md shadow-md">
            <h2 className="font-bold">{product.productName}</h2>
            <img src={product.productImage} alt="" className="w-48 h-48 m-auto" />
            <p>{product.productDescription}</p>
            <p className="text-lg font-semibold">Price : {product.srp} - php</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductsPage
