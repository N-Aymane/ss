// This is a mock implementation for demo purposes
// In a real app, this would connect to a database

import { v4 as uuidv4 } from "uuid"

// Mock data store
let drops = [
  {
    id: "1",
    title: "Summer Essentials Collection",
    description: "Our new summer collection featuring lightweight, breathable fabrics perfect for warm weather.",
    dropDate: "2025-06-15T10:00:00.000Z",
    productIds: ["1", "3"],
  },
  {
    id: "2",
    title: "Winter Capsule",
    description: "Stay warm with our new winter collection featuring premium wool and insulated pieces.",
    dropDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    productIds: ["2", "6"],
  },
]

// Site settings
let siteSettings = {
  closedMode: false,
  closedModeDropId: null,
}

export async function getDrops() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return drops
}

export async function getNextDrop() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // If we're in closed mode and have a specific drop ID selected
  if (siteSettings.closedMode && siteSettings.closedModeDropId) {
    const selectedDrop = drops.find((drop) => drop.id === siteSettings.closedModeDropId)
    if (selectedDrop) {
      return selectedDrop
    }
  }

  // Otherwise return the next upcoming drop
  const now = new Date()
  const futureDrops = drops
    .filter((drop) => new Date(drop.dropDate) > now)
    .sort((a, b) => new Date(a.dropDate) - new Date(b.dropDate))

  return futureDrops[0] || null
}

export async function getDropByProductId(productId) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return drops.find((drop) => drop.productIds.includes(productId)) || null
}

export async function saveDrop(drop) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (drop.id) {
    // Update existing drop
    drops = drops.map((d) => (d.id === drop.id ? { ...drop } : d))
    return drop
  } else {
    // Create new drop
    const newDrop = {
      ...drop,
      id: uuidv4(),
    }
    drops.push(newDrop)
    return newDrop
  }
}

export async function deleteDrop(id) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  drops = drops.filter((drop) => drop.id !== id)
  return true
}

export async function getSiteSettings() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  return siteSettings
}

export async function updateSiteSettings(settings) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  siteSettings = { ...siteSettings, ...settings }
  return siteSettings
}

export async function toggleClosedMode(enabled, dropId = null) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Update the site settings
  siteSettings.closedMode = enabled
  siteSettings.closedModeDropId = enabled ? dropId : null

  return siteSettings
}
