"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

type CartItem = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  totalPrice: number
  isLoading: boolean
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { status } = useSession()

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + item.product.price * item.quantity, 0)

  // Fetch cart on initial load and when auth status changes
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true)
      try {
        // If user is not authenticated, get cart from localStorage
        if (status === "unauthenticated") {
          const localCart = localStorage.getItem("cart")
          if (localCart) {
            setItems(JSON.parse(localCart))
          }
          setIsLoading(false)
          return
        }

        // If user is authenticated, get cart from API
        if (status === "authenticated") {
          const response = await fetch("/api/cart")

          // If unauthorized, use local cart
          if (response.status === 401) {
            const localCart = localStorage.getItem("cart")
            if (localCart) {
              setItems(JSON.parse(localCart))
            }
            setIsLoading(false)
            return
          }

          if (!response.ok) {
            throw new Error("Failed to fetch cart")
          }

          const cart = await response.json()
          if (cart && cart.items) {
            setItems(cart.items)
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
        toast({
          title: "Error",
          description: "Failed to load your cart. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [toast, status])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (status === "unauthenticated" && !isLoading) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, status, isLoading])

  const addItem = async (productId: string, quantity = 1) => {
    try {
      // If user is not authenticated, update local cart
      if (status === "unauthenticated") {
        // Fetch product details
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }
        const product = await response.json()

        // Update local cart
        setItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex((item) => item.product.id === productId)

          if (existingItemIndex > -1) {
            // Update existing item
            const updatedItems = [...prevItems]
            updatedItems[existingItemIndex].quantity += quantity
            return updatedItems
          } else {
            // Add new item
            return [
              ...prevItems,
              {
                id: `local-${Date.now()}`,
                quantity,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  images: product.images,
                },
              },
            ]
          }
        })

        toast({
          title: "Added to cart",
          description: "Item has been added to your cart.",
        })
        return
      }

      // If user is authenticated, update cart via API
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to cart")
      }

      const newItem = await response.json()

      // Update local state
      const existingItemIndex = items.findIndex((item) => item.product.id === productId)

      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...items]
        updatedItems[existingItemIndex].quantity += quantity
        setItems(updatedItems)
      } else {
        // Add new item
        setItems((prev) => [...prev, newItem])
      }

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      // If user is not authenticated, update local cart
      if (status === "unauthenticated") {
        if (quantity <= 0) {
          // Remove item from local state
          setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
        } else {
          // Update quantity in local state
          setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
        }
        return
      }

      // If user is authenticated, update cart via API
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to update cart")
      }

      if (quantity <= 0) {
        // Remove item from local state
        setItems((prev) => prev.filter((item) => item.id !== itemId))
      } else {
        // Update quantity in local state
        setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      // If user is not authenticated, update local cart
      if (status === "unauthenticated") {
        // Remove item from local state
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))

        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart.",
        })
        return
      }

      // If user is authenticated, update cart via API
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from cart")
      }

      // Remove item from local state
      setItems((prev) => prev.filter((item) => item.id !== itemId))

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        isLoading,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

