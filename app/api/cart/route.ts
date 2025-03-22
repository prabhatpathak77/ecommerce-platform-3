import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Get cart
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.cart) {
      // Create a new cart if one doesn't exist
      const cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      // Transform cart items to include parsed images
      const transformedCart = {
        ...cart,
        items: cart.items.map((item) => ({
          ...item,
          product: {
            ...item.product,
            images: JSON.parse(item.product.imagesJson),
            imagesJson: undefined,
          },
        })),
      }

      return NextResponse.json(transformedCart)
    }

    // Transform cart items to include parsed images
    const transformedCart = {
      ...user.cart,
      items: user.cart.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          images: JSON.parse(item.product.imagesJson),
          imagesJson: undefined,
        },
      })),
    }

    return NextResponse.json(transformedCart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
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
    } else {
      // Add new item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: { product: true },
      })

      // Transform product to include parsed images
      const transformedItem = {
        ...newItem,
        product: {
          ...newItem.product,
          images: JSON.parse(newItem.product.imagesJson),
          imagesJson: undefined,
        },
      }

      return NextResponse.json(transformedItem)
    }
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

