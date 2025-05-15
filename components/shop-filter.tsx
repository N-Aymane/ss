"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function ShopFilter() {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
  })

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const categories = [
    { id: "all", label: "All Products", count: 24 },
    { id: "tshirts", label: "T-Shirts", count: 8 },
    { id: "hoodies", label: "Hoodies & Sweatshirts", count: 6 },
    { id: "pants", label: "Pants & Trousers", count: 5 },
    { id: "outerwear", label: "Outerwear", count: 3 },
    { id: "accessories", label: "Accessories", count: 2 },
  ]

  const sizes = [
    { id: "xs", label: "XS" },
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
  ]

  const colors = [
    { id: "black", label: "Black", color: "bg-black" },
    { id: "white", label: "White", color: "bg-white border" },
    { id: "gray", label: "Gray", color: "bg-gray-500" },
    { id: "beige", label: "Beige", color: "bg-amber-100" },
    { id: "gold", label: "Gold", color: "bg-gold" },
  ]

  const FilterSection = ({ title, isOpen, onToggle, children }) => (
    <div className="py-5 border-b border-gold/20">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left font-serif tracking-wider mb-4"
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  )

  // Desktop filter
  const DesktopFilter = () => (
    <div className="space-y-1">
      <FilterSection title="CATEGORY" isOpen={openSections.category} onToggle={() => toggleSection("category")}>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between group cursor-pointer">
              <span className="font-light text-sm tracking-wide group-hover:text-gold transition-colors">
                {category.label}
              </span>
              <span className="text-xs text-gray-400">({category.count})</span>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="PRICE" isOpen={openSections.price} onToggle={() => toggleSection("price")}>
        <div className="space-y-6 px-1">
          <Slider
            defaultValue={[0, 500]}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mt-6"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm font-light">${priceRange[0]}</span>
            <span className="text-sm font-light">${priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="SIZE" isOpen={openSections.size} onToggle={() => toggleSection("size")}>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <div
              key={size.id}
              className="h-9 w-9 border border-gold/30 flex items-center justify-center text-sm font-light cursor-pointer hover:border-gold hover:text-gold transition-colors"
            >
              {size.label}
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="COLOR" isOpen={openSections.color} onToggle={() => toggleSection("color")}>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <div
              key={color.id}
              className={`h-6 w-6 rounded-full ${color.color} cursor-pointer hover:ring-1 hover:ring-offset-1 hover:ring-gold transition-all`}
              title={color.label}
            />
          ))}
        </div>
      </FilterSection>

      <div className="pt-6">
        <Button className="w-full rounded-none text-sm tracking-widest font-light bg-black text-gold hover:bg-gold hover:text-black">
          APPLY FILTERS
        </Button>
      </div>
    </div>
  )

  // Mobile filter (in a sheet)
  const MobileFilter = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden w-full justify-between rounded-none border-gold/30">
          <span className="font-light tracking-wide">Filter & Sort</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] bg-offwhite">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4 border-gold/20">
          <SheetTitle className="font-serif tracking-wider">FILTERS</SheetTitle>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <div className="mt-6 overflow-y-auto h-[calc(100%-10rem)]">
          <DesktopFilter />
        </div>
        <div className="border-t pt-4 mt-4 flex gap-4 border-gold/20">
          <Button
            variant="outline"
            className="flex-1 rounded-none text-sm tracking-widest font-light border-gold/30 text-gold hover:bg-transparent"
          >
            CLEAR ALL
          </Button>
          <Button className="flex-1 rounded-none text-sm tracking-widest font-light bg-black text-gold hover:bg-gold hover:text-black">
            VIEW RESULTS
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      <div className="hidden lg:block">
        <h2 className="font-serif text-xl tracking-wider mb-6">FILTERS</h2>
        <DesktopFilter />
      </div>
      <div className="lg:hidden">
        <MobileFilter />
      </div>
    </>
  )
}
