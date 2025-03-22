"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function CartDropdown() {
  const [open, setOpen] = useState(false)
  const { items, itemCount, totalPrice, removeItem } = useCart()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
          {itemCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-white">
              {itemCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <h3 className="font-medium">Your Cart</h3>
          <p className="text-sm text-muted-foreground">
            {itemCount === 0 ? "Your cart is empty" : `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart`}
          </p>
        </div>
        <DropdownMenuSeparator />

        {items.length > 0 ? (
          <>
            <div className="max-h-[300px] overflow-auto p-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted">
                  <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
                    <img
                      src={item.product.images[0] || "/placeholder.svg?height=48&width=48"}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-4">
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/cart" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" className="flex-1" onClick={() => setOpen(false)}>
                  <Button className="w-full">Checkout</Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <ShoppingCart className="mb-2 h-10 w-10 text-muted-foreground" />
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Your cart is empty. Add some items to get started!
            </p>
            <Link href="/marketplace" onClick={() => setOpen(false)}>
              <Button>Browse Products</Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

