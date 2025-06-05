import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@salesucre.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12)
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true,
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create cart for admin
  await prisma.cart.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
    },
  })

  // Create sample products
  const products = [
    {
      name: 'Signature Logo Tee - Black',
      description: 'Our iconic black t-shirt featuring the gold SUCRESALÉ CO. logo. Made from premium cotton for exceptional comfort and durability.',
      price: 89.99,
      imageUrl: '/images/products/black-tshirt.png',
      category: 'tshirts',
      colors: JSON.stringify(['black']),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    },
    {
      name: 'Signature Logo Tee - Navy',
      description: 'A sophisticated navy blue t-shirt with our gold emblem. Crafted from the finest cotton with a relaxed fit.',
      price: 89.99,
      imageUrl: '/images/products/navy-tshirt.png',
      category: 'tshirts',
      colors: JSON.stringify(['navy']),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    },
    {
      name: 'Signature Logo Tee - Cream',
      description: 'Elegant cream t-shirt with our signature black logo. Made from 100% organic cotton with a premium feel.',
      price: 89.99,
      imageUrl: '/images/products/cream-tshirt.png',
      category: 'tshirts',
      colors: JSON.stringify(['cream']),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    },
    {
      name: 'Essential Hoodie',
      description: 'A warm, versatile hoodie perfect for layering. Made from premium materials with meticulous attention to detail.',
      price: 189.99,
      imageUrl: '/placeholder.svg?height=900&width=600',
      category: 'hoodies',
      colors: JSON.stringify(['black', 'cream']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    },
    {
      name: 'Relaxed Pants',
      description: 'Comfortable, relaxed-fit pants for everyday elegance. Tailored from Japanese cotton with a subtle texture.',
      price: 159.99,
      imageUrl: '/placeholder.svg?height=900&width=600',
      category: 'pants',
      colors: JSON.stringify(['black', 'cream']),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
    },
    {
      name: 'Structured Jacket',
      description: 'A lightweight jacket with a structured silhouette. Crafted with precision for the perfect fit and timeless style.',
      price: 249.99,
      imageUrl: '/placeholder.svg?height=900&width=600',
      category: 'outerwear',
      colors: JSON.stringify(['black']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    },
  ]

  const createdProducts = []
  for (const productData of products) {
    // Check if product already exists
    const existingProduct = await prisma.product.findFirst({
      where: { name: productData.name },
    })

    let product
    if (existingProduct) {
      product = await prisma.product.update({
        where: { id: existingProduct.id },
        data: productData,
      })
      console.log('✅ Product updated:', product.name)
    } else {
      product = await prisma.product.create({
        data: productData,
      })
      console.log('✅ Product created:', product.name)
    }

    createdProducts.push(product)
  }

  // Create sample drops
  const drops = [
    {
      title: 'Summer Essentials Collection',
      description: 'Our new summer collection featuring lightweight, breathable fabrics perfect for warm weather.',
      dropDate: new Date('2025-06-15T10:00:00.000Z'),
      productIds: [createdProducts[0].id, createdProducts[2].id], // Black and Cream tees
    },
    {
      title: 'Winter Capsule',
      description: 'Stay warm with our new winter collection featuring premium wool and insulated pieces.',
      dropDate: new Date(Date.now() - 86400000), // Yesterday
      productIds: [createdProducts[1].id, createdProducts[5].id], // Navy tee and Jacket
    },
  ]

  for (const dropData of drops) {
    const { productIds, ...dropInfo } = dropData

    // Check if drop already exists
    const existingDrop = await prisma.drop.findFirst({
      where: { title: dropData.title },
    })

    let drop
    if (existingDrop) {
      drop = await prisma.drop.update({
        where: { id: existingDrop.id },
        data: dropInfo,
      })
      console.log('✅ Drop updated:', drop.title)
    } else {
      drop = await prisma.drop.create({
        data: dropInfo,
      })
      console.log('✅ Drop created:', drop.title)
    }

    // Clear existing drop products
    await prisma.dropProduct.deleteMany({
      where: { dropId: drop.id },
    })

    // Create new drop products
    for (const productId of productIds) {
      await prisma.dropProduct.create({
        data: {
          dropId: drop.id,
          productId,
        },
      })
    }
  }

  // Create site settings
  const existingSettings = await prisma.siteSettings.findFirst()
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        closedMode: false,
        closedModeDropId: null,
      },
    })
  }

  console.log('✅ Site settings created')
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
