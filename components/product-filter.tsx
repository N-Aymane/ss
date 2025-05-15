"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function ProductFilter() {
  const [priceRange, setPriceRange] = useState([0, 500])

  const categories = [
    { id: "tshirts", label: "T-Shirts" },
    { id: "hoodies", label: "Hoodies" },
    { id: "pants", label: "Pants" },
    { id: "accessories", label: "Accessories" },
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
  ]

  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <Button variant="outline" className="w-full">
          <ChevronDown className="mr-2 h-4 w-4" />
          Filter Products
        </Button>
      </div>

      <div className="hidden lg:block space-y-6">
        <div>
          <h3 className="font-medium mb-4">Categories</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox id={`category-${category.id}`} />
                <Label htmlFor={`category-${category.id}`} className="ml-2 text-sm font-normal">
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-4">Price Range</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">${priceRange[0]}</span>
              <span className="text-sm">${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <h3 className="font-medium">Size</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-3">
              {sizes.map((size) => (
                <div key={size.id} className="flex items-center">
                  <Checkbox id={`size-${size.id}`} />
                  <Label htmlFor={`size-${size.id}`} className="ml-2 text-sm font-normal">
                    {size.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <h3 className="font-medium">Color</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="space-y-3">
              {colors.map((color) => (
                <div key={color.id} className="flex items-center">
                  <Checkbox id={`color-${color.id}`} />
                  <div className={`ml-2 h-4 w-4 rounded-full ${color.color}`} />
                  <Label htmlFor={`color-${color.id}`} className="ml-2 text-sm font-normal">
                    {color.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  )
}
