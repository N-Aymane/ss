// This is a mock implementation for demo purposes
// In a real app, this would connect to a database

import { v4 as uuidv4 } from "uuid"

// Mock data store
let products = [
  {
    id: "1",
    name: "Signature Logo Tee - Black",
    description:
      "Our iconic black t-shirt featuring the gold SUCRESALÉ CO. logo. Made from premium cotton for exceptional comfort and durability.",
    price: 89.99,
    imageUrl: "/images/products/black-tshirt.png",
    category: "tshirts",
    colors: ["black"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "Signature Logo Tee - Navy",
    description:
      "A sophisticated navy blue t-shirt with our gold emblem. Crafted from the finest cotton with a relaxed fit.",
    price: 89.99,
    imageUrl: "/images/products/navy-tshirt.png",
    category: "tshirts",
    colors: ["navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "3",
    name: "Signature Logo Tee - Cream",
    description:
      "Elegant cream t-shirt with our signature black logo. Made from 100% organic cotton with a premium feel.",
    price: 89.99,
    imageUrl: "/images/products/cream-tshirt.png",
    category: "tshirts",
    colors: ["cream"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "4",
    name: "Essential Hoodie",
    description:
      "A warm, versatile hoodie perfect for layering. Made from premium materials with meticulous attention to detail.",
    price: 189.99,
    imageUrl: "/placeholder.svg?height=900&width=600",
    category: "hoodies",
    colors: ["black", "cream"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "5",
    name: "Relaxed Pants",
    description:
      "Comfortable, relaxed-fit pants for everyday elegance. Tailored from Japanese cotton with a subtle texture.",
    price: 159.99,
    imageUrl: "/placeholder.svg?height=900&width=600",
    category: "pants",
    colors: ["black", "cream"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "6",
    name: "Structured Jacket",
    description:
      "A lightweight jacket with a structured silhouette. Crafted with precision for the perfect fit and timeless style.",
    price: 249.99,
    imageUrl: "/placeholder.svg?height=900&width=600",
    category: "outerwear",
    colors: ["black"],
    sizes: ["S", "M", "L", "XL"],
  },
]

export async function getProducts() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Log the products being returned to verify data
  console.log(
    "Products data:",
    products.map((p) => ({ id: p.id, name: p.name, imageUrl: p.imageUrl })),
  )

  return products
}

export async function getAllProducts() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return products
}

export async function getProductById(id) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return products.find((product) => product.id === id) || null
}

export async function saveProduct(product) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (product.id) {
    // Update existing product
    products = products.map((p) => (p.id === product.id ? { ...product } : p))
    return product
  } else {
    // Create new product
    const newProduct = {
      ...product,
      id: uuidv4(),
    }
    products.push(newProduct)
    return newProduct
  }
}

export async function deleteProduct(id) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  products = products.filter((product) => product.id !== id)
  return true
}

export async function getProductsByCategory(category) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))
  return products.filter((product) => product.category === category)
}
