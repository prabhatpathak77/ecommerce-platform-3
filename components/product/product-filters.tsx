"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

type Category = {
  name: string
  count: number
}

const CATEGORIES: Category[] = [
  { name: "Earrings", count: 24 },
  { name: "Necklaces", count: 18 },
  { name: "Bracelets", count: 15 },
  { name: "Rings", count: 12 },
  { name: "Bags", count: 10 },
  { name: "Scarves", count: 8 },
  { name: "Hair Accessories", count: 7 },
  { name: "Watches", count: 6 },
  { name: "Eyewear", count: 5 },
  { name: "Anklets", count: 4 },
]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setSelectedCategories(category.split(","))
    }

    const min = searchParams.get("minPrice")
    const max = searchParams.get("maxPrice")

    if (min) setMinPrice(min)
    if (max) setMaxPrice(max)
    if (min && max) setPriceRange([Number(min), Number(max)])
  }, [searchParams])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
    setMinPrice(values[0].toString())
    setMaxPrice(values[1].toString())
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMinPrice(value)
    if (value && !isNaN(Number(value))) {
      setPriceRange([Number(value), priceRange[1]])
    }
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMaxPrice(value)
    if (value && !isNaN(Number(value))) {
      setPriceRange([priceRange[0], Number(value)])
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Apply category filter
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","))
    } else {
      params.delete("category")
    }

    // Apply price filter
    if (minPrice) {
      params.set("minPrice", minPrice)
    } else {
      params.delete("minPrice")
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice)
    } else {
      params.delete("maxPrice")
    }

    router.push(`/marketplace?${params.toString()}`)
    setOpen(false)
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 200])
    setMinPrice("")
    setMaxPrice("")
    router.push("/marketplace")
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 md:hidden">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="mb-3 font-medium">Category</h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <div key={category.name} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`mobile-${category.name}`}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                  />
                  <label
                    htmlFor={`mobile-${category.name}`}
                    className="ml-2 flex items-center justify-between w-full text-sm"
                  >
                    <span>{category.name}</span>
                    <span className="text-muted-foreground">({category.count})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <h3 className="mb-3 font-medium">Price Range</h3>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 200]}
                value={priceRange}
                min={0}
                max={200}
                step={1}
                onValueChange={handlePriceRangeChange}
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="min-price-mobile">Min Price</Label>
                  <Input
                    id="min-price-mobile"
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max-price-mobile">Max Price</Label>
                  <Input
                    id="max-price-mobile"
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button className="flex-1" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

