import Link from "next/link"
import Image from "next/image"
import DropBadge from "./drop-badge"
import { getDropByProductId } from "@/lib/drops"

export default async function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map(async (product) => {
        const drop = await getDropByProductId(product.id)

        return (
          <Link key={product.id} href={`/shop/${product.id}`} className="group">
            <div className="relative aspect-[3/4] w-full overflow-hidden mb-6">
              <Image
                src={product.imageUrl || "/placeholder.svg?height=900&width=600"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              {drop && <DropBadge drop={drop} className="absolute top-4 right-4" />}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 bg-offwhite bg-opacity-0 group-hover:bg-opacity-90 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 p-4">
                <button className="w-full py-2 border border-black text-sm font-light tracking-wider hover:bg-black hover:text-gold transition-colors">
                  QUICK VIEW
                </button>
              </div>
            </div>
            <h3 className="font-light text-lg tracking-wide">{product.name}</h3>
            <p className="text-gold font-light mt-1">${product.price.toFixed(2)}</p>
          </Link>
        )
      })}
    </div>
  )
}
