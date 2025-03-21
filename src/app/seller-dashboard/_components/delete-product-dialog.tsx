/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "../../../hooks/use-toast"

interface DeleteProductDialogProps {
  productId: number
  productName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProductDialog({ productId, productName, open, onOpenChange }: DeleteProductDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // Log the endpoint being called for debugging
      console.log(`Deleting product at endpoint: /api/products/${productId}`)
      
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      // Handle specific error cases
      if (response.status === 405) { // Method Not Allowed
        throw new Error(`The API endpoint doesn't support the DELETE method. Please ensure your API route handler implements DELETE.`)
      } else if (!response.ok) {
        // Safely try to parse the error response as JSON
        let errorMessage = `Server error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          // If JSON parsing fails, use status text or a generic message
          console.log("Failed to parse error response as JSON")
        }
        throw new Error(errorMessage)
      }

      toast({
        title: "Product Deleted",
        description: `${productName} has been deleted successfully`,
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "Failed to delete product. Please check your API configuration.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{productName}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}