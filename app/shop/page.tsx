import { getProducts } from "@/lib/products"
import ProductGrid from "@/components/product-grid"
import ShopFilter from "@/components/shop-filter"
import { Suspense } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Shop | NEC CO.",
  description: "Browse our collection of minimal, timeless clothing essentials",
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="bg-offwhite">
      {/* Hero section */}
      <div className="relative h-[40vh] bg-black text-offwhite flex items-center justify-center mb-16">
        <div className="text-center z-10 px-4">
          <h1 className="font-serif text-4xl md:text-5xl tracking-wider mb-6 text-gold">COLLECTION</h1>
          <p className="max-w-xl mx-auto font-light tracking-wide text-gray-300">
            Explore our curated selection of timeless essentials designed for the modern wardrobe.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        {/* Mobile filter trigger */}
        <div className="lg:hidden mb-8">
          <Button variant="outline" className="w-full justify-between rounded-none border-gold/30">
            <span className="font-light tracking-wide">Filter & Sort</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar with filters - desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ShopFilter />
              </Suspense>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="mb-10 flex justify-between items-center">
              <h2 className="font-serif text-xl tracking-wider">ALL PIECES</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 font-light">{products.length} products</span>
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm font-light">Sort by:</span>
                  <select className="text-sm font-light border-b border-gold/30 py-1 pr-8 focus:outline-none bg-transparent">
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            <Suspense
              fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading products...</div>}
            >
              <ProductGrid products={products} />
            </Suspense>

            <div className="mt-16 text-center">
              <p className="text-gray-500 font-light mb-6 max-w-md mx-auto">
                Our collection is carefully curated and updated regularly with new essential pieces.
              </p>
              <Button
                variant="outline"
                className="rounded-none px-8 py-6 text-sm tracking-widest font-light border-black hover:bg-black hover:text-gold"
              >
                LOAD MORE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
