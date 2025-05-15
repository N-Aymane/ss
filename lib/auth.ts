// This is a mock implementation for demo purposes
// In a real app, this would use a proper authentication system

// Mock admin credentials
const ADMIN_EMAIL = "admin@example.com"
const ADMIN_PASSWORD = "password123"

// Mock JWT token
let authToken = null

export async function login(email, password) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Generate a mock token
    authToken = `mock-jwt-token-${Date.now()}`

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", authToken)
    }

    return true
  } else {
    throw new Error("Invalid credentials")
  }
}

export async function logout() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  authToken = null

  // Remove from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }

  return true
}

export async function checkAuth() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Check localStorage for token
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("authToken")
    if (storedToken) {
      authToken = storedToken
      return true
    }
  }

  return !!authToken
}
