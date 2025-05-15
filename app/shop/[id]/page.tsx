import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/products"
import { getDropByProductId } from "@/lib/drops"
import DropBadge from "@/components/drop-badge"

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} | NEC CO.`,
    description: product.description,
  }
}

export default async function ProductPage({ params }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const drop = await getDropByProductId(params.id)

  return (
    <div className="container mx-auto px-4 py-12 bg-offwhite">
      <Link
        href="/shop"
        className="inline-flex items-center text-gray-600 hover:text-gold mb-12 font-light tracking-wide"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=900&width=600"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {drop && <DropBadge drop={drop} className="absolute top-6 right-6" />}
        </div>

        <div className="space-y-10">
          <div>
            <h1 className="font-serif text-3xl tracking-wider mb-3">{product.name}</h1>
            <p className="text-2xl font-light text-gold">${product.price.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg tracking-wider">Description</h2>
            <p className="text-gray-600 font-light leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg tracking-wider">Size</h2>
            <div className="flex flex-wrap gap-3">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  className="h-12 w-12 rounded-none font-light border-gold/30 hover:border-gold hover:text-gold"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <Button
            className="w-full rounded-none h-14 text-sm tracking-widest font-light bg-black text-gold hover:bg-gold hover:text-black"
            size="lg"
          >
            ADD TO CART
          </Button>

          <div className="pt-6 border-t border-gold/20">
            <div className="space-y-4">
              <h2 className="font-serif text-lg tracking-wider">Details</h2>
              <ul className="space-y-2 text-gray-600 font-light">
                <li>• 100% premium materials</li>
                <li>• Ethically manufactured</li>
                <li>• Designed for longevity</li>
                <li>• Timeless silhouette</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
