import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/products"
import { getDropByProductId } from "@/lib/drops"
import DropBadge from "@/components/drop-badge"
import { getAllProducts } from "@/lib/products"
import AddToCartButton from "@/components/add-to-cart-button"

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} | SALESUCRE CO.`,
    description: product.description,
  }
}

export default async function ProductPage({ params }) {
  const product = await getProductById(params.id)
  const products = await getAllProducts()

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
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
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



          <AddToCartButton product={product} />

          <div className="pt-6 border-t border-gold/20">
            <div className="space-y-4">
              <h2 className="font-serif text-lg tracking-wider">Details</h2>
              <ul className="space-y-2 text-gray-600 font-light">
                <li>• 100% premium cotton</li>
                <li>• Ethically manufactured</li>
                <li>• Designed for longevity</li>
                <li>• Timeless silhouette</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Product recommendations */}
      <div className="mt-24">
        <h2 className="font-serif text-2xl tracking-wider mb-10 text-center">YOU MAY ALSO LIKE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map(
            (relatedProduct) =>
              relatedProduct.id !== product.id && (
                <Link key={relatedProduct.id} href={`/shop/${relatedProduct.id}`} className="group">
                  <div className="relative aspect-[3/4] w-full overflow-hidden mb-4">
                    <Image
                      src={relatedProduct.imageUrl || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-light text-base tracking-wide">{relatedProduct.name}</h3>
                  <p className="text-gold font-light mt-1">${relatedProduct.price.toFixed(2)}</p>
                </Link>
              ),
          )}
        </div>
      </div>
    </div>
  )
}
