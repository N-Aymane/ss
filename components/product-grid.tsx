import Link from "next/link"
import Image from "next/image"
import DropBadge from "./drop-badge"
import { getDropByProductId } from "@/lib/drops"

export default async function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map(async (product) => {
        const drop = await getDropByProductId(product.id)

        // Debug log to check product data
        console.log(`Rendering product: ${product.id} - ${product.name} - Image: ${product.imageUrl}`)

        return (
          <Link key={product.id} href={`/shop/${product.id}`} className="group">
            <div className="relative aspect-[3/4] w-full overflow-hidden mb-6 bg-cream">
              {/* Debug border to see container */}
              <div className="absolute inset-0 border border-gold/10 z-10"></div>

              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
              {drop && <DropBadge drop={drop} className="absolute top-4 right-4 z-20" />}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-0"></div>

              <div className="absolute bottom-0 left-0 right-0 bg-offwhite bg-opacity-0 group-hover:bg-opacity-90 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 p-4 z-20">
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
