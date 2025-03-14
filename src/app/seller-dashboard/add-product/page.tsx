"use client"

import type React from "react"

import { useState } from "react"
import { Save, X } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SellerDashboardShell } from "../_components/seller-dashboard-shell"

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    units: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to your API
    console.log("Form submitted:", formData)
    // Reset form or redirect
  }

  return (
    <SellerDashboardShell>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-orange-800">Add New Product</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-orange-200">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save Product
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Enter the basic details of your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="Enter product SKU"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => handleSelectChange("category", value)} value={formData.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="pesticides">Pesticides</SelectItem>
                      <SelectItem value="seeds">Seeds</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="chemicals">Chemicals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                  <CardDescription>Set the price and stock information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="units">Available Units</Label>
                    <Input
                      id="units"
                      name="units"
                      type="number"
                      placeholder="0"
                      value={formData.units}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>Upload an image of your product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40 border-2 border-dashed border-orange-200 rounded-md bg-orange-50">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Drag and drop an image here, or click to browse</p>
                      <Button variant="outline" className="mt-4 border-orange-200">
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-6">
            <CardFooter className="flex justify-between pt-6">
              <Button variant="outline" className="border-orange-200">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                <Save className="mr-2 h-4 w-4" />
                Save Product
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </SellerDashboardShell>
  )
}

