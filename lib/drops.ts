import { prisma } from './db'

export interface Drop {
  id: string
  title: string
  description: string
  dropDate: Date
  productIds: string[]
  createdAt: Date
  updatedAt: Date
}

export interface SiteSettings {
  id: string
  closedMode: boolean
  closedModeDropId: string | null
  createdAt: Date
  updatedAt: Date
}

function parseDropWithProducts(dbDrop: any): Drop {
  return {
    ...dbDrop,
    productIds: dbDrop.dropProducts.map((dp: any) => dp.productId),
  }
}

export async function getDrops(): Promise<Drop[]> {
  const dbDrops = await prisma.drop.findMany({
    include: {
      dropProducts: true,
    },
    orderBy: { dropDate: 'desc' },
  })

  return dbDrops.map(parseDropWithProducts)
}

export async function getNextDrop(): Promise<Drop | null> {
  const siteSettings = await getSiteSettings()

  // If we're in closed mode and have a specific drop ID selected
  if (siteSettings?.closedMode && siteSettings.closedModeDropId) {
    const selectedDrop = await prisma.drop.findUnique({
      where: { id: siteSettings.closedModeDropId },
      include: {
        dropProducts: true,
      },
    })
    if (selectedDrop) {
      return parseDropWithProducts(selectedDrop)
    }
  }

  // Otherwise return the next upcoming drop
  const now = new Date()
  const futureDrop = await prisma.drop.findFirst({
    where: {
      dropDate: {
        gt: now,
      },
    },
    include: {
      dropProducts: true,
    },
    orderBy: { dropDate: 'asc' },
  })

  return futureDrop ? parseDropWithProducts(futureDrop) : null
}

export async function getDropByProductId(productId: string): Promise<Drop | null> {
  const dbDrop = await prisma.drop.findFirst({
    where: {
      dropProducts: {
        some: {
          productId,
        },
      },
    },
    include: {
      dropProducts: true,
    },
  })

  return dbDrop ? parseDropWithProducts(dbDrop) : null
}

export async function saveDrop(drop: Partial<Drop> & { id?: string; productIds: string[] }): Promise<Drop> {
  const dropData = {
    title: drop.title!,
    description: drop.description!,
    dropDate: drop.dropDate!,
  }

  if (drop.id) {
    // Update existing drop
    const dbDrop = await prisma.drop.update({
      where: { id: drop.id },
      data: dropData,
      include: {
        dropProducts: true,
      },
    })

    // Update drop products
    await prisma.dropProduct.deleteMany({
      where: { dropId: drop.id },
    })

    if (drop.productIds.length > 0) {
      await prisma.dropProduct.createMany({
        data: drop.productIds.map(productId => ({
          dropId: drop.id!,
          productId,
        })),
      })
    }

    const updatedDrop = await prisma.drop.findUnique({
      where: { id: drop.id },
      include: {
        dropProducts: true,
      },
    })

    return parseDropWithProducts(updatedDrop!)
  } else {
    // Create new drop
    const dbDrop = await prisma.drop.create({
      data: dropData,
      include: {
        dropProducts: true,
      },
    })

    // Create drop products
    if (drop.productIds.length > 0) {
      await prisma.dropProduct.createMany({
        data: drop.productIds.map(productId => ({
          dropId: dbDrop.id,
          productId,
        })),
      })
    }

    const newDrop = await prisma.drop.findUnique({
      where: { id: dbDrop.id },
      include: {
        dropProducts: true,
      },
    })

    return parseDropWithProducts(newDrop!)
  }
}

export async function deleteDrop(id: string): Promise<boolean> {
  await prisma.drop.delete({
    where: { id },
  })
  return true
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const settings = await prisma.siteSettings.findFirst()
  return settings
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const existingSettings = await prisma.siteSettings.findFirst()

  if (existingSettings) {
    return await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: settings,
    })
  } else {
    return await prisma.siteSettings.create({
      data: {
        closedMode: settings.closedMode ?? false,
        closedModeDropId: settings.closedModeDropId ?? null,
      },
    })
  }
}

export async function toggleClosedMode(enabled: boolean, dropId: string | null = null): Promise<SiteSettings> {
  return updateSiteSettings({
    closedMode: enabled,
    closedModeDropId: enabled ? dropId : null,
  })
}
