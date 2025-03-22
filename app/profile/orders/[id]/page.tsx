"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Truck, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

type Order = {
  id: string
  total: number
  status: string
  createdAt: string
  items: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      images: string[]
    }
  }[]
  shippingInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentInfo: {
    cardName: string
    lastFourDigits: string
  }
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/profile/orders")
    }

    // Fetch order if authenticated
    if (status === "authenticated") {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`/api/orders/${params.id}`)
          if (!response.ok) {
            throw new Error("Failed to fetch order")
          }

          const data = await response.json()

          // Parse shipping and payment info from JSON strings
          setOrder({
            ...data,
            shippingInfo: JSON.parse(data.shippingInfo),
            paymentInfo: JSON.parse(data.paymentInfo),
          })
        } catch (error) {
          console.error("Error fetching order:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchOrder()
    }
  }, [status, router, params.id])

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="mb-6 h-10 w-64" />
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/profile/orders"
          className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Order Not Found</h2>
            <p className="mb-6 text-center text-muted-foreground">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link href="/profile/orders">View Your Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate order summary
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.07
  const total = subtotal + shipping + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/profile/orders"
        className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <Badge
          className="text-base"
          variant={
            order.status === "DELIVERED"
              ? "default"
              : order.status === "SHIPPED"
                ? "secondary"
                : order.status === "PROCESSING"
                  ? "outline"
                  : order.status === "CANCELLED"
                    ? "destructive"
                    : "outline"
          }
        >
          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
        </Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                    <img
                      src={item.product.images[0] || "/placeholder.svg?height=80&width=80"}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-sm">${item.price.toFixed(2)} each</div>
                  </div>
                  <div className="text-right font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Information */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingInfo.fullName}</p>
                <p>{order.shippingInfo.address}</p>
                <p>
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                </p>
                <p>{order.shippingInfo.country}</p>
                <Separator className="my-2" />
                <p>Email: {order.shippingInfo.email}</p>
                <p>Phone: {order.shippingInfo.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Card: •••• •••• •••• {order.paymentInfo.lastFourDigits}</p>
                <p>Name: {order.paymentInfo.cardName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full bg-primary"></div>
                    <div className="h-full w-0.5 bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-6 w-6 rounded-full ${order.status === "PENDING" ? "bg-muted" : "bg-primary"}`}
                    ></div>
                    <div className={`h-full w-0.5 ${order.status === "PENDING" ? "bg-muted" : "bg-primary"}`}></div>
                  </div>
                  <div>
                    <p className={`font-medium ${order.status === "PENDING" ? "text-muted-foreground" : ""}`}>
                      Processing
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.status !== "PENDING" ? "Order is being processed" : "Waiting to be processed"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-6 w-6 rounded-full ${order.status === "SHIPPED" || order.status === "DELIVERED" ? "bg-primary" : "bg-muted"}`}
                    ></div>
                    <div
                      className={`h-full w-0.5 ${order.status === "SHIPPED" || order.status === "DELIVERED" ? "bg-primary" : "bg-muted"}`}
                    ></div>
                  </div>
                  <div>
                    <p
                      className={`font-medium ${order.status === "SHIPPED" || order.status === "DELIVERED" ? "" : "text-muted-foreground"}`}
                    >
                      Shipped
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "SHIPPED" || order.status === "DELIVERED"
                        ? "Your order is on the way"
                        : "Not yet shipped"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-6 w-6 rounded-full ${order.status === "DELIVERED" ? "bg-primary" : "bg-muted"}`}
                    ></div>
                  </div>
                  <div>
                    <p className={`font-medium ${order.status === "DELIVERED" ? "" : "text-muted-foreground"}`}>
                      Delivered
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.status === "DELIVERED" ? "Your order has been delivered" : "Not yet delivered"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

