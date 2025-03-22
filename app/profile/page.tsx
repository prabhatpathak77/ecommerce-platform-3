"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Edit, Package, ShoppingBag, UserIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/profile")
    }

    // Fetch orders if authenticated
    if (status === "authenticated") {
      const fetchOrders = async () => {
        try {
          const response = await fetch("/api/orders")
          if (!response.ok) {
            throw new Error("Failed to fetch orders")
          }

          const data = await response.json()

          // Parse shipping info from JSON string
          const parsedOrders = data.map((order: any) => ({
            ...order,
            shippingInfo: JSON.parse(order.shippingInfo),
          }))

          setOrders(parsedOrders)
        } catch (error) {
          console.error("Error fetching orders:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchOrders()
    }
  }, [status, router])

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="mt-4 h-6 w-40" />
                  <Skeleton className="mt-2 h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Skeleton className="h-10 w-full" />
            <div className="mt-6 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Profile Sidebar */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={session?.user?.name || "User"} />
                  <AvatarFallback>{session?.user?.name?.slice(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-bold">{session?.user?.name}</h2>
                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>

                <Button variant="outline" size="sm" className="mt-4">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              <Separator className="my-6" />

              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Account Details
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/profile/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/profile/addresses">
                    <Package className="mr-2 h-4 w-4" />
                    Addresses
                  </Link>
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div>
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="details">Account Details</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription>View and track your recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-xl font-semibold">No orders yet</h3>
                      <p className="mb-6 text-muted-foreground">
                        You haven't placed any orders yet. Start shopping to see your orders here.
                      </p>
                      <Button asChild>
                        <Link href="/marketplace">Browse Products</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="rounded-lg border p-4">
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Order #{order.id.slice(-8).toUpperCase()}</p>
                              <p className="text-sm text-muted-foreground">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge
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
                              <span className="font-medium">${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="mb-4 grid gap-4 sm:grid-cols-2">
                            <div>
                              <h4 className="mb-2 text-sm font-medium">Shipping Address</h4>
                              <p className="text-sm">{order.shippingInfo.fullName}</p>
                              <p className="text-sm">{order.shippingInfo.address}</p>
                              <p className="text-sm">
                                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                              </p>
                              <p className="text-sm">{order.shippingInfo.country}</p>
                            </div>
                            <div>
                              <h4 className="mb-2 text-sm font-medium">Order Items</h4>
                              <ul className="space-y-2">
                                {order.items.map((item) => (
                                  <li key={item.id} className="flex items-center gap-2">
                                    <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                                      <img
                                        src={item.product.images[0] || "/placeholder.svg?height=40&width=40"}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{item.product.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {item.quantity} x ${item.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/profile/orders/${order.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-medium">Name</h4>
                        <p>{session?.user?.name}</p>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-medium">Email</h4>
                        <p>{session?.user?.email}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium">Account Type</h4>
                      <p>{session?.user?.role === "ADMIN" ? "Administrator" : "Customer"}</p>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium">Member Since</h4>
                      <p>January 2023</p>
                    </div>

                    <div className="pt-4">
                      <Button>Update Information</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Addresses</CardTitle>
                  <CardDescription>Manage your shipping and billing addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">Default Address</h4>
                        <Badge>Default</Badge>
                      </div>
                      <p className="text-sm">John Doe</p>
                      <p className="text-sm">123 Main Street</p>
                      <p className="text-sm">Anytown, CA 12345</p>
                      <p className="text-sm">United States</p>
                      <p className="text-sm">Phone: (555) 123-4567</p>

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center rounded-lg border border-dashed p-4">
                      <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Address
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

