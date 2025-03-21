/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "../../../hooks/use-toast"


// Define the product type
type Product = {
  id?: number
  name: string
  description: string
  category: string
  price: string
  availableUnits: string
  photoUrl: string
}

type ProductFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product // Optional for edit mode
  mode: "add" | "edit"
}

export function ProductFormModal({ open, onOpenChange, product, mode }: ProductFormModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with product data or empty values
  const [formData, setFormData] = useState<Product>(
    product || {
      name: "",
      description: "",
      category: "",
      price: "",
      availableUnits: "",
      photoUrl: "",
    },
  )

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.name || !formData.price || !formData.availableUnits) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // API endpoint and method based on mode
      const endpoint = mode === "add" ? "/api/products" : `/api/products/${product?.id}`
      
      // Check if we're in development mode and need to use a different HTTP method
      // In development, implement a fallback to make it work temporarily
      const method = mode === "add" ? "POST" : "PUT"
      
      // For debugging - log the endpoint and method being used
      console.log(`Submitting to ${endpoint} with method ${method}`)

      // Submit the form data
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // Handle specific error cases
      if (response.status === 405) { // Method Not Allowed
        throw new Error(`The API endpoint doesn't support the ${method} method. Please make sure your API routes are properly configured.`)
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

      // Success message
      toast({
        title: mode === "add" ? "Product Added" : "Product Updated",
        description:
          mode === "add" ? "Your product has been added successfully" : "Your product has been updated successfully",
      })

      // Close the modal and refresh the page
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error submitting product:", error)
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "Failed to save product. Please check your API configuration.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Product" : "Edit Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {["Agriculture", "Pesticides", "Testing", "Seeds", "Equipment", "Other"].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="availableUnits">Available Units *</Label>
                <Input
                  id="availableUnits"
                  name="availableUnits"
                  type="number"
                  min="0"
                  value={formData.availableUnits}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                name="photoUrl"
                type="url"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "add" ? "Add Product" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}