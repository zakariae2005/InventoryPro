"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Store } from "lucide-react"
import Link from "next/link"

const storeCategories = [
  "Clothing & Fashion",
  "Electronics & Tech",
  "Food & Beverages",
  "Handmade & Crafts",
  "Digital Products",
  "Books & Media",
  "Health & Beauty",
  "Home & Garden",
  "Sports & Outdoors",
  "Toys & Games",
  "Automotive",
  "Art & Collectibles",
  "Other",
]

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Other",
]

export default function CreateStore() {
  const [formData, setFormData] = useState({
    storeName: "",
    storeType: "",
    description: "",
    address: "",
    country: "",
    city: "",
    contactEmail: "",
    phoneNumber: "",
    website: "",
    openingHours: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const router = useRouter()

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    // Map frontend field names to backend field names
    const payload = {
      name: formData.storeName,           // storeName -> name
      category: formData.storeType,       // storeType -> category
      description: formData.description,
      address: formData.address,
      country: formData.country,
      city: formData.city,
      email: formData.contactEmail,       // contactEmail -> email
      phone: formData.phoneNumber,        // phoneNumber -> phone
      website: formData.website,
      openingHours: formData.openingHours,
    }

    const res = await fetch("/api/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),  // Send mapped payload instead of formData
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Failed to create store")
    }

    const data = await res.json()
    console.log("Store created:", data)
    router.push("/")
  } catch (err) {
    console.error("Error:", err)
    // You might want to show an error message to the user
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Store className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Let&apos;s set up your store</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your online presence and start selling to customers worldwide. Fill in the details below to get
            started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Basic Information
              </CardTitle>
              <CardDescription>Tell us about your store and what you&apos;re selling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name *</Label>
                  <Input
                    id="storeName"
                    placeholder="Enter your store name"
                    value={formData.storeName}
                    onChange={(e) => handleInputChange("storeName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeType">Store Category *</Label>
                  <Select value={formData.storeType} onValueChange={(value) => handleInputChange("storeType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Store Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your store sells and what makes it special..."
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Location
              </CardTitle>
              <CardDescription>Where is your store located?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your store address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Contact Information
              </CardTitle>
              <CardDescription>How can customers reach you? (all optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="store@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website / Social Media</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourstore.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Opening Hours</Label>
                  <Input
                    id="openingHours"
                    placeholder="Mon-Fri 9AM-6PM"
                    value={formData.openingHours}
                    onChange={(e) => handleInputChange("openingHours", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="px-8">
                Save as Draft
              </Button>
              <Button type="submit" className="px-8">
                Create Store
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
