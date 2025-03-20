import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderId(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "ORD-"

  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}



export function generateProductId(): string {
  // Generate 2 random uppercase letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const letter1 = letters.charAt(Math.floor(Math.random() * letters.length))
  const letter2 = letters.charAt(Math.floor(Math.random() * letters.length))

  // Generate 4 random numbers
  const numbers = Math.floor(1000 + Math.random() * 9000)

  return `${letter1}${letter2}${numbers}`
}

