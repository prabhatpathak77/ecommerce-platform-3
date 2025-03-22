"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Heart, Minus, Plus, Share2, ShieldCheck, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart/cart-provider"
import { Skeleton } from "@/components/ui/skeleton"

type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  inventory: number
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }

        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, quantity)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 pb-16">
        <div className="container mx-auto px-4 py-4">
          <Link href="/marketplace" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((img) => (
                  <Skeleton key={img} className="aspect-square w-full rounded-md" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="mb-2 h-8 w-1/3" />
              <Skeleton className="mb-4 h-10 w-2/3" />
              <Skeleton className="mb-6 h-6 w-1/4" />
              <Skeleton className="mb-6 h-24 w-full" />
              <Skeleton className="mb-6 h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card>
          <CardContent className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
            <p className="mb-6 text-muted-foreground">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/marketplace">
              <Button>Return to Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/marketplace" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border bg-white">
              <img
                src={product.images[activeImage] || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`cursor-pointer overflow-hidden rounded-md border bg-white ${activeImage === index ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={img || `/placeholder.svg?height=150&width=150`}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Badge variant="outline">{product.category}</Badge>
              {product.inventory < 10 && <Badge className="bg-amber-500 hover:bg-amber-600">Low Stock</Badge>}
            </div>
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center">
                <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-2 text-sm font-medium">5.0 (48 reviews)</span>
              </div>
              <span className="text-sm text-muted-foreground">In stock: {product.inventory}</span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              <span className="ml-2 text-sm text-muted-foreground line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">20% OFF</span>
            </div>

            <Separator className="my-6" />

            <div className="mb-6 space-y-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
              <ul className="grid gap-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-emerald-500" />
                  <span>Premium quality materials</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-emerald-500" />
                  <span>Handcrafted with attention to detail</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-emerald-500" />
                  <span>Free shipping on orders over $50</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-emerald-500" />
                  <span>30-day money-back guarantee</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-semibold">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-r-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex h-10 w-14 items-center justify-center border-y bg-background text-center font-medium">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-l-none"
                  onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                  disabled={quantity >= product.inventory}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1">
                Buy Now
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <p className="text-sm font-medium">Secure Checkout</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                We protect your payment information using encryption to provide bank-level security.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (48)</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Product Details</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-medium">Materials</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Material</span>
                          <span>Sterling Silver, Freshwater Pearl</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Finish</span>
                          <span>Polished</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Gemstone</span>
                          <span>Pearl</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Metal</span>
                          <span>Sterling Silver</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Weight</span>
                          <span>2.5g</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">Dimensions</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Length</span>
                          <span>1.5 inches</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Width</span>
                          <span>0.5 inches</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Pearl Size</span>
                          <span>8mm</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Chain Length</span>
                          <span>N/A</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Customer Reviews</h3>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold">5.0</div>
                      <div className="flex items-center justify-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">48 reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="mb-1 flex items-center gap-2">
                          <div className="text-sm">{rating} stars</div>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: rating === 5 ? "100%" : rating === 4 ? "0%" : "0%" }}
                            ></div>
                          </div>
                          <div className="text-sm">{rating === 5 ? "48" : "0"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div className="space-y-6">
                    {[1, 2, 3].map((review, index) => (
                      <div key={review}>
                        <div className="mb-2 flex items-center gap-2">
                          <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                            <img
                              src={`/placeholder.svg?height=40&width=40`}
                              alt="Reviewer"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Sarah Johnson</p>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="ml-2 text-xs text-muted-foreground">
                                {index === 0 ? "2 days ago" : index === 1 ? "1 week ago" : `${index + 1} weeks ago`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review % 2 === 0
                            ? "These earrings are absolutely beautiful! The pearls have a gorgeous luster and the silver setting is elegant. They're lightweight and comfortable to wear all day. I've received many compliments already!"
                            : "Great experience overall. Fast delivery and excellent communication throughout the process. The product exceeded my expectations."}
                        </p>
                        {review !== 3 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    View All Reviews
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Link href="#" key={item}>
                <Card className="overflow-hidden border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={`/placeholder.svg?height=300&width=300`}
                      alt="Product"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 font-semibold">Crystal Drop Earrings</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${(39.99 + item * 5).toFixed(2)}</span>
                      <div className="flex items-center text-sm text-yellow-500">
                        4.8 <span className="ml-1">★</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

