"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/components/cart/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ProductCardProps = {
  product: {
    id: string
    name: string
    price: number
    images: string[]
    category: string
    featured?: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product.id, 1)
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card
        className="group overflow-hidden border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0] || `/placeholder.svg?height=300&width=300`}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {product.featured && <Badge className="absolute left-2 top-2 bg-primary hover:bg-primary/90">Featured</Badge>}

          <div
            className={`absolute bottom-0 left-0 right-0 flex justify-center gap-2 bg-black/60 p-2 transition-transform duration-300 ${isHovered ? "translate-y-0" : "translate-y-full"}`}
          >
            <Button size="sm" className="flex-1 bg-white text-primary hover:bg-white/90" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 border-white bg-transparent text-white hover:bg-white/20"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="outline" className="rounded-sm px-2 py-0 text-xs font-normal">
              {product.category}
            </Badge>
            <div className="flex items-center text-sm text-yellow-500">
              <Star className="mr-1 h-3 w-3 fill-yellow-500" />
              <span>4.8</span>
            </div>
          </div>
          <h3 className="mb-1 font-semibold">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

