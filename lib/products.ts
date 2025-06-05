import { prisma } from './db'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  category: string
  colors: string[]
  sizes: string[]
  createdAt: Date
  updatedAt: Date
}

function parseProduct(dbProduct: any): Product {
  return {
    ...dbProduct,
    colors: JSON.parse(dbProduct.colors),
    sizes: JSON.parse(dbProduct.sizes),
  }
}

export async function getProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return dbProducts.map(parseProduct)
}

export async function getAllProducts(): Promise<Product[]> {
  return getProducts()
}

export async function getProductById(id: string): Promise<Product | null> {
  const dbProduct = await prisma.product.findUnique({
    where: { id },
  })

  if (!dbProduct) return null
  return parseProduct(dbProduct)
}

export async function saveProduct(product: Partial<Product> & { id?: string }): Promise<Product> {
  const productData = {
    name: product.name!,
    description: product.description!,
    price: product.price!,
    imageUrl: product.imageUrl,
    category: product.category!,
    colors: JSON.stringify(product.colors),
    sizes: JSON.stringify(product.sizes),
  }

  if (product.id) {
    // Update existing product
    const dbProduct = await prisma.product.update({
      where: { id: product.id },
      data: productData,
    })
    return parseProduct(dbProduct)
  } else {
    // Create new product
    const dbProduct = await prisma.product.create({
      data: productData,
    })
    return parseProduct(dbProduct)
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  await prisma.product.delete({
    where: { id },
  })
  return true
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' },
  })

  return dbProducts.map(parseProduct)
}
