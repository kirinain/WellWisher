// Backend API base URL
// For local development: http://localhost:8000/api
// For production: Update this to your production API URL
// Note: Use 'localhost' or '127.0.0.1' for browser requests, not '0.0.0.0'
// export const API_BASE_URL = "http://localhost:8000/api"
export const API_BASE_URL = "https://wellwishers-backend.onrender.com/api"

// Types
export interface User {
  _id?: string  // MongoDB _id from backend
  name: string
  email: string
  treeId: string
  treeName: string
  treeDecos: Ornament[]
}

export interface Ornament {
  name: string
  email: string
  ornament: string
  message: string
  userId: string
  x: number
  y: number
  createdAt: string
  updatedAt: string
}

export interface TreeData {
  treeOwner: {
    name: string
    email: string
  }
  treeId: string
  treeName: string
  treeDecos: Ornament[]
}

export interface SignupRequest {
  name: string
  email: string
}

export interface SignupResponse {
  message: string
  user: User
}

export interface AddOrnamentRequest {
  name: string
  email: string
  ornament: string
  message: string
  userId: string
  x: number
  y: number
}

export interface AddOrnamentResponse {
  message: string
  ornament: Ornament
  treeDecos: Ornament[]
}

// Generate UUID for userId (simple implementation)
export function generateUserId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// API Functions

/**
 * Signup or login a user
 * Creates a new user if email doesn't exist, otherwise returns existing user
 */
export async function signupOrLogin(data: SignupRequest): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Get tree data by treeId
 */
export async function getTree(treeId: string): Promise<TreeData> {
  const response = await fetch(`${API_BASE_URL}/tree/${treeId}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Tree not found')
    }
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Get user details by treeId
 * Retrieves complete user details including all user information and timestamps
 */
export async function getUserByTreeId(treeId: string): Promise<User & { createdAt: string; updatedAt: string }> {
  const response = await fetch(`${API_BASE_URL}/user/tree/${treeId}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found')
    }
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Add an ornament to a tree
 */
export async function addOrnament(
  treeId: string,
  data: AddOrnamentRequest
): Promise<AddOrnamentResponse> {
  const response = await fetch(`${API_BASE_URL}/tree/${treeId}/ornament`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Tree not found')
    }
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Get all ornaments for a tree
 */
export async function getOrnaments(treeId: string): Promise<{
  treeId: string
  treeName: string
  treeOwner: { name: string; email: string }
  ornaments: Ornament[]
}> {
  const response = await fetch(`${API_BASE_URL}/tree/${treeId}/ornaments`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Tree not found')
    }
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Generate a shareable link for a tree
 */
export function getTreeShareLink(treeId: string): string {
  if (typeof window === "undefined") {
    return ""
  }
  const baseUrl = window.location.origin
  return `${baseUrl}/tree?treeId=${treeId}`
}