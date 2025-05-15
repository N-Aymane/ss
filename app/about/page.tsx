import Image from "next/image"

export const metadata = {
  title: "About | Minimal Essentials",
  description: "Learn about our brand philosophy and commitment to quality",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>

      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p className="text-gray-600">
            Founded in 2023, Minimal Essentials was born from a desire to create clothing that stands the test of time.
            We believe in the power of simplicity and the beauty of well-crafted garments that become the foundation of
            your wardrobe.
          </p>
          <p className="text-gray-600">
            Our team of designers draws inspiration from architecture, nature, and urban landscapes to create pieces
            that are both functional and aesthetically pleasing. We focus on clean lines, premium materials, and
            thoughtful details.
          </p>
        </div>
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
          <Image src="/placeholder.svg?height=800&width=600" alt="Our Story" fill className="object-cover" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div className="order-2 md:order-1 relative h-[400px] w-full overflow-hidden rounded-lg">
          <Image src="/placeholder.svg?height=800&width=600" alt="Our Philosophy" fill className="object-cover" />
        </div>
        <div className="order-1 md:order-2 space-y-4">
          <h2 className="text-2xl font-semibold">Our Philosophy</h2>
          <p className="text-gray-600">
            We believe that less is more. Our design philosophy centers around creating versatile pieces that can be
            styled in multiple ways and worn across seasons. We reject the fast fashion model and instead focus on
            creating garments that are built to last.
          </p>
          <p className="text-gray-600">
            Sustainability is at the core of everything we do. We carefully select our materials and manufacturing
            partners to ensure ethical production and minimal environmental impact.
          </p>
        </div>
      </div>

      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
        <p className="text-gray-600">
          We are committed to creating clothing that respects both people and the planet. From our design process to our
          packaging, we strive to make choices that reduce our environmental footprint and promote fair labor practices.
        </p>
      </div>
    </div>
  )
}
