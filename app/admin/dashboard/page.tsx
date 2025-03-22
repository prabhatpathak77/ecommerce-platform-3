"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        setStats({
          totalSales: 12589.99,
          totalOrders: 156,
          totalProducts: 48,
          totalUsers: 237,
          recentOrders: [
            { id: "ord-001", user: "John Doe", total: 129.99, status: "PROCESSING", date: "2023-05-15T10:30:00Z" },
            { id: "ord-002", user: "Jane Smith", total: 89.5, status: "SHIPPED", date: "2023-05-14T14:20:00Z" },
            { id: "ord-003", user: "Robert Johnson", total: 245.75, status: "DELIVERED", date: "2023-05-13T09:15:00Z" },
            { id: "ord-004", user: "Emily Davis", total: 75.25, status: "PENDING", date: "2023-05-12T16:45:00Z" },
            { id: "ord-005", user: "Michael Brown", total: 189.99, status: "DELIVERED", date: "2023-05-11T11:10:00Z" },
          ],
          topProducts: [
            { id: "prod-001", name: "Pearl Drop Earrings", sales: 42, revenue: 2099.58 },
            { id: "prod-002", name: "Gold Chain Necklace", sales: 38, revenue: 3039.62 },
            { id: "prod-003", name: "Silver Bangle Bracelet", sales: 35, revenue: 1399.65 },
            { id: "prod-004", name: "Leather Handbag", sales: 28, revenue: 3639.72 },
            { id: "prod-005", name: "Crystal Hair Clip", sales: 25, revenue: 749.75 },
          ],
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store's performance and recent activity.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/products/new">
              <Package className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <h3 className="mt-1 text-2xl font-bold">${stats.totalSales.toLocaleString()}</h3>
              </div>
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <h3 className="mt-1 text-2xl font-bold">{stats.totalOrders}</h3>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <h3 className="mt-1 text-2xl font-bold">{stats.totalProducts}</h3>
              </div>
              <div className="rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="mt-1 text-2xl font-bold">{stats.totalUsers}</h3>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              <span>3% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your customers</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={order.user} />
                      <AvatarFallback>{order.user.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{order.user}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best selling products this month</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 overflow-hidden rounded-md bg-muted">
                      <img
                        src={`/placeholder.svg?height=36&width=36`}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                    </div>
                  </div>
                  <p className="font-medium">${product.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-16 w-16" />
              <p>Sales chart will be displayed here</p>
              <p className="text-sm">Integrate with a charting library like Chart.js or Recharts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

