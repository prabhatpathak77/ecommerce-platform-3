"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SortDesc, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product/product-card"
import { ProductFilters } from "@/components/product/product-filters"
import { Skeleton } from "@/components/ui/skeleton"

type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  inventory: number
  featured: boolean
}

export default function Marketplace() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("newest")

  // Get filters from URL
  const categoryParam = searchParams.get("category")
  const minPriceParam = searchParams.get("minPrice")
  const maxPriceParam = searchParams.get("maxPrice")
  const searchParam = searchParams.get("search")

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Build query params
        const params = new URLSearchParams()

        if (categoryParam) {
          params.set("category", categoryParam)
        }

        if (minPriceParam) {
          params.set("minPrice", minPriceParam)
        }

        if (maxPriceParam) {
          params.set("maxPrice", maxPriceParam)
        }

        if (searchParam) {
          params.set("search", searchParam)
          setSearchQuery(searchParam)
        }

        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        let data = await response.json()

        // Apply client-side sorting
        if (sortOption === "price-low") {
          data = data.sort((a: Product, b: Product) => a.price - b.price)
        } else if (sortOption === "price-high") {
          data = data.sort((a: Product, b: Product) => b.price - a.price)
        } else if (sortOption === "newest") {
          // Assuming products are already sorted by newest from the API
        }

        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [categoryParam, minPriceParam, maxPriceParam, searchParam, sortOption])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }

    window.location.href = `/marketplace?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 py-12 dark:from-violet-950 dark:via-indigo-950 dark:to-purple-950">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-3xl font-bold text-white md:text-4xl">Women's Accessories</h1>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for earrings, necklaces, bracelets..."
                className="h-12 bg-white pl-10 text-base shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <div className="hidden rounded-lg border bg-card p-6 shadow-sm lg:block">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  window.location.href = "/marketplace"
                }}
              >
                Reset All
              </Button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="mb-3 font-medium">Category</h3>
                <div className="space-y-2">
                  {[
                    "Earrings",
                    "Necklaces",
                    "Bracelets",
                    "Rings",
                    "Bags",
                    "Scarves",
                    "Hair Accessories",
                    "Watches",
                  ].map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={category}
                        className="h-4 w-4 rounded border-gray-300 text-primary"
                        checked={categoryParam?.split(",").includes(category) || false}
                        onChange={() => {
                          const params = new URLSearchParams(searchParams.toString())
                          const categories = params.get("category")?.split(",") || []

                          if (categories.includes(category)) {
                            const newCategories = categories.filter((c) => c !== category)
                            if (newCategories.length > 0) {
                              params.set("category", newCategories.join(","))
                            } else {
                              params.delete("category")
                            }
                          } else {
                            params.set("category", [...categories, category].join(","))
                          }

                          window.location.href = `/marketplace?${params.toString()}`
                        }}
                      />
                      <label htmlFor={category} className="ml-2 text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="mb-3 font-medium">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    className="h-9"
                    defaultValue={minPriceParam || ""}
                    onBlur={(e) => {
                      if (e.target.value) {
                        const params = new URLSearchParams(searchParams.toString())
                        params.set("minPrice", e.target.value)
                        window.location.href = `/marketplace?${params.toString()}`
                      }
                    }}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    className="h-9"
                    defaultValue={maxPriceParam || ""}
                    onBlur={(e) => {
                      if (e.target.value) {
                        const params = new URLSearchParams(searchParams.toString())
                        params.set("maxPrice", e.target.value)
                        window.location.href = `/marketplace?${params.toString()}`
                      }
                    }}
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  // This would normally submit the form, but we're handling filters via URL params
                  // This button is here for UX consistency
                  const minPrice = document.querySelector('input[placeholder="Min"]') as HTMLInputElement
                  const maxPrice = document.querySelector('input[placeholder="Max"]') as HTMLInputElement

                  const params = new URLSearchParams(searchParams.toString())

                  if (minPrice?.value) {
                    params.set("minPrice", minPrice.value)
                  }

                  if (maxPrice?.value) {
                    params.set("maxPrice", maxPrice.value)
                  }

                  window.location.href = `/marketplace?${params.toString()}`
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            {/* Sorting and View Options */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ProductFilters />
                <Tabs defaultValue="all" className="w-full sm:w-auto">
                  <TabsList>
                    <TabsTrigger
                      value="all"
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString())
                        params.delete("featured")
                        window.location.href = `/marketplace?${params.toString()}`
                      }}
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="featured"
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString())
                        params.set("featured", "true")
                        window.location.href = `/marketplace?${params.toString()}`
                      }}
                    >
                      Featured
                    </TabsTrigger>
                    <TabsTrigger value="new">New Arrivals</TabsTrigger>
                    <TabsTrigger value="sale">Sale</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="h-9 w-[180px]">
                    <SortDesc className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden border-none">
                    <Skeleton className="aspect-square w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="mb-2 h-4 w-1/3" />
                      <Skeleton className="mb-2 h-6 w-2/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Tag className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-xl font-semibold">No products found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-8 flex items-center justify-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  1
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  2
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-violet-50">
                  3
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  4
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  5
                </Button>
                <span className="mx-1">...</span>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  10
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

