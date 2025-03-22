import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Update cart item
export async function PATCH(request: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { quantity } = await request.json()

    if (quantity === undefined) {
      return NextResponse.json({ error: "Quantity is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { cart: true },
    })

    if (!user || !user.cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Verify the item belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        cartId: user.cart.id,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: { id: params.itemId },
      })

      return NextResponse.json({ message: "Item removed from cart" })
    } else {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: params.itemId },
        data: { quantity },
        include: { product: true },
      })

      // Transform product to include parsed images
      const transformedItem = {
        ...updatedItem,
        product: {
          ...updatedItem.product,
          images: JSON.parse(updatedItem.product.imagesJson),
          imagesJson: undefined,
        },
      }

      return NextResponse.json(transformedItem)
    }
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

// Delete cart item
export async function DELETE(request: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { cart: true },
    })

    if (!user || !user.cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Verify the item belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.itemId,
        cartId: user.cart.id,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: params.itemId },
    })

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}

