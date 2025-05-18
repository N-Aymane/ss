import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import DropCountdown from "@/components/drop-countdown"
import ProductGrid from "@/components/product-grid"
import { getProducts } from "@/lib/products"
import { getNextDrop, getSiteSettings } from "@/lib/drops"

export default async function Home() {
  const siteSettings = await getSiteSettings()

  // If site is in closed mode, show only the countdown
  if (siteSettings.closedMode) {
    const nextDrop = await getNextDrop()

    // If no drop is selected or available, show a simple closed message
    if (!nextDrop) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-offwhite p-4">
          <Image src="/images/logo.png" alt="SALESUCRE CO." width={300} height={75} className="mb-12" />
          <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl font-light tracking-wide text-gold">
            We are preparing something special.
          </p>
        </div>
      )
    }

    // Show countdown for the selected drop
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-offwhite p-4">
        <Image src="/images/logo.png" alt="SALESUCRE CO." width={300} height={75} className="mb-12" />
        <p className="text-xl md:text-2xl mb-12 text-center max-w-2xl font-light tracking-wide text-gold">
          {nextDrop.title}
        </p>
        <div className="flex items-center gap-6 mb-12">
          <Clock className="h-8 w-8 text-gold" />
          <DropCountdown date={nextDrop.dropDate} />
        </div>
        <p className="text-lg text-center max-w-xl font-light tracking-wide opacity-80">{nextDrop.description}</p>
      </div>
    )
  }

  // Normal site mode
  const products = await getProducts()
  const nextDrop = await getNextDrop()

  return (
    <div className="bg-offwhite">
      {/* Hero Section */}
      <section className="mb-24">
        <div className="relative h-[85vh] w-full overflow-hidden">
          <Image
            src="/images/products/black-tshirt.png"
            alt="Hero Image"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-offwhite p-6">
            <div className="max-w-3xl text-center">
              <Image src="/images/logo.png" alt="SALESUCRE CO." width={400} height={100} className="mb-12 mx-auto" />
              <p className="text-xl md:text-2xl mb-12 font-light tracking-wide max-w-xl mx-auto animate-fade-in animate-slide-up stagger-1 text-gold-light">
                Timeless pieces for the modern wardrobe
              </p>
              <Button
                asChild
                size="lg"
                className="text-offwhite bg-transparent border border-gold hover:bg-gold hover:text-black rounded-none px-8 py-6 text-sm tracking-widest font-light animate-fade-in animate-slide-up stagger-2"
              >
                <Link href="/shop">EXPLORE COLLECTION</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Drop Countdown Section */}
      {nextDrop && (
        <section className="mb-24 bg-black text-offwhite p-12 md:p-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 md:max-w-xl">
              <h2 className="font-serif text-3xl md:text-4xl tracking-wider text-gold">{nextDrop.title}</h2>
              <p className="text-gray-300 font-light tracking-wide leading-relaxed">{nextDrop.description}</p>
              <Button
                variant="outline"
                className="text-gold border-gold hover:bg-gold hover:text-black rounded-none px-6 text-sm tracking-widest font-light"
              >
                GET NOTIFIED
              </Button>
            </div>
            <div className="flex items-center gap-6">
              <Clock className="h-8 w-8 text-gold" />
              <DropCountdown date={nextDrop.dropDate} />
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="mb-24 container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-serif text-3xl tracking-wider">FEATURED PIECES</h2>
          <Link
            href="/shop"
            className="text-gray-600 hover:text-gold underline-offset-8 hover:underline font-light tracking-wide"
          >
            VIEW ALL
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 4)} />
      </section>

      {/* About Section Preview */}
      <section className="mb-24 container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-3xl tracking-wider">OUR PHILOSOPHY</h2>
          <p className="text-gray-600 font-light tracking-wide leading-relaxed">
            We believe in creating timeless pieces that transcend seasonal trends. Our garments are designed with
            intention, focusing on quality materials and thoughtful construction that honors both tradition and
            innovation.
          </p>
          <Button
            variant="outline"
            asChild
            className="rounded-none px-6 text-sm tracking-widest font-light border-black hover:bg-black hover:text-offwhite"
          >
            <Link href="/about">LEARN MORE</Link>
          </Button>
        </div>
        <div className="relative h-[500px] w-full overflow-hidden">
          <Image src="/images/products/cream-tshirt.png" alt="About Image" fill className="object-contain" />
        </div>
      </section>

      {/* Luxury Materials Section */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl tracking-wider text-center mb-16">EXCEPTIONAL CRAFTSMANSHIP</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-gold text-4xl font-serif">01</span>
              </div>
              <h3 className="font-serif text-xl mb-4">Premium Materials</h3>
              <p className="text-gray-600 font-light">
                We source only the finest fabrics and materials from renowned suppliers around the world.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-gold text-4xl font-serif">02</span>
              </div>
              <h3 className="font-serif text-xl mb-4">Artisanal Techniques</h3>
              <p className="text-gray-600 font-light">
                Each piece is crafted using traditional methods combined with modern innovation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-gold text-4xl font-serif">03</span>
              </div>
              <h3 className="font-serif text-xl mb-4">Timeless Design</h3>
              <p className="text-gray-600 font-light">
                Our designs transcend trends, creating enduring pieces that become wardrobe staples.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
