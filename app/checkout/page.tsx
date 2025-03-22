"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Lock, ShieldCheck } from "lucide-react"
import { useCart } from "@/components/cart/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("shipping")
  const [formData, setFormData] = useState({
    // Shipping info
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",

    // Payment info
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const router = useRouter()
  const { items, totalPrice, isLoading: isCartLoading } = useCart()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .slice(0, 19)
    }

    // Format expiry date with slash
    if (name === "expiryDate") {
      formattedValue = value.replace(/\//g, "")
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`
      }
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateShippingForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
      valid = false
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      valid = false
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
      valid = false
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
      valid = false
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
      valid = false
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const validatePaymentForm = () => {
    let valid = true
    const newErrors = { ...errors }

    // Validate card number (16 digits)
    if (!formData.cardNumber.replace(/\s/g, "")) {
      newErrors.cardNumber = "Card number is required"
      valid = false
    } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = "Invalid card number format"
      valid = false
    }

    // Validate card name
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required"
      valid = false
    }

    // Validate expiry date (MM/YY format)
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required"
      valid = false
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid format (MM/YY)"
      valid = false
    } else {
      const [month, year] = formData.expiryDate.split("/").map(Number)
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Invalid month"
        valid = false
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = "Card has expired"
        valid = false
      }
    }

    // Validate CVV (3 or 4 digits)
    if (!formData.cvv) {
      newErrors.cvv = "CVV is required"
      valid = false
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      setActiveTab("payment")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePaymentForm()) return

    setIsLoading(true)

    try {
      // Prepare shipping and payment info
      const shippingInfo = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }

      const paymentInfo = {
        cardName: formData.cardName,
        // In a real app, you would not send the full card details to your server
        // Instead, you would use a payment processor like Stripe
        lastFourDigits: formData.cardNumber.slice(-4),
      }

      // Process the order
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingInfo,
          paymentInfo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process order")
      }

      const data = await response.json()

      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      })

      // Redirect to success page
      router.push(`/checkout/success?orderId=${data.order.id}`)
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 text-muted-foreground"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
            <p className="mb-6 text-center text-muted-foreground">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link href="/marketplace">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="shipping" className="flex-1">
                1. Shipping
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex-1" disabled={!validateShippingForm()}>
                2. Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Shipping Information</h2>
                  <form className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={errors.state ? "border-red-500" : ""}
                        />
                        {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className={errors.zipCode ? "border-red-500" : ""}
                        />
                        {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className={errors.country ? "border-red-500" : ""}
                        />
                        {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleContinueToPayment}
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Payment Information</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="flex items-center gap-2">
                          <img src="/placeholder.svg?height=24&width=36" alt="Visa" className="h-6" />
                          <img src="/placeholder.svg?height=24&width=36" alt="Mastercard" className="h-6" />
                          <img src="/placeholder.svg?height=24&width=36" alt="Amex" className="h-6" />
                        </div>
                      </div>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className={`pl-10 ${errors.cardNumber ? "border-red-500" : ""}`}
                          value={formData.cardNumber}
                          onChange={handleChange}
                          disabled={isLoading}
                          maxLength={19}
                        />
                      </div>
                      {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        className={errors.cardName ? "border-red-500" : ""}
                        value={formData.cardName}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.cardName && <p className="text-xs text-red-500">{errors.cardName}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          className={errors.expiryDate ? "border-red-500" : ""}
                          value={formData.expiryDate}
                          onChange={handleChange}
                          disabled={isLoading}
                          maxLength={5}
                        />
                        {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          className={errors.cvv ? "border-red-500" : ""}
                          value={formData.cvv}
                          onChange={handleChange}
                          disabled={isLoading}
                          maxLength={4}
                          type="password"
                        />
                        {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Secure Payment</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your payment information is encrypted and secure. We never store your full card details.
                      </p>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                      {isLoading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

              <div className="max-h-[300px] overflow-auto">
                {items.map((item) => (
                  <div key={item.id} className="mb-4 flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                      <img
                        src={item.product.images[0] || "/placeholder.svg?height=64&width=64"}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shipping</span>
                  <span>{totalPrice > 100 ? "Free" : "$10.00"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tax</span>
                  <span>${(totalPrice * 0.07).toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice > 100 ? 0 : 10) + totalPrice * 0.07).toFixed(2)}</span>
              </div>

              <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-emerald-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <h3 className="font-medium">Secure Transaction</h3>
                </div>
                <p className="mt-1 text-sm">
                  Your payment is protected by our secure payment system. All transactions are encrypted and secure.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

