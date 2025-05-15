// This is a mock implementation for demo purposes
// In a real app, this would connect to a database

import { v4 as uuidv4 } from "uuid"

// Mock data store
let products = [
  {
    id: "1",
    name: "Minimal Tee",
    description: "A simple, comfortable t-shirt made from 100% organic cotton.",
    price: 39.99,
    imageUrl: "/placeholder.svg?height=900&width=600",
  },
  {
    id: "2",
    name: "Essential Hoodie",
    description: "A warm, versatile hoodie perfect for layering.",
    price: 89.99,
    imageUrl: "/placeholder.svg?height=900&width=600",
  },
  {
    id: "3",
    name: "Relaxed Pants",
    description: "Comfortable, relaxed-fit pants for everyday wear.",
    price: 69.99,
    imageUrl: "/placeholder.svg?height=900&width=600",
  },
  {
    id: "4",
    name: "Structured Jacket",
    description: "A lightweight jacket with a structured silhouette.",
    price: 129.99,
    imageUrl: "/placeholder.svg?height=900&width=600",
  },
  {
    id: "5",
    name: "Canvas Tote",
    description: "A durable canvas tote bag for everyday use.",
    price: 49.99,
    imageUrl: "/placeholder.svg?height=900&width=600",
  },
  {
    id: "6",
    name: "Wool Beanie",
    description: "A warm wool beanie for cold weather.",
    price: 34.99,
    imageUrl: "/placeholder.svg?height=900&width=600",
  },
]

export async function getProducts() {
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
