import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category")
  const featured = searchParams.get("featured") === "true"
  const search = searchParams.get("search")
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(featured ? { featured: true } : {}),
        ...(search
          ? {
              OR: [{ name: { contains: search } }, { description: { contains: search } }],
            }
          : {}),
        ...(minPrice !== undefined || maxPrice !== undefined
          ? {
              price: {
                ...(minPrice !== undefined ? { gte: minPrice } : {}),
                ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform the products to include parsed images
    const transformedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.imagesJson),
      imagesJson: undefined,
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, images, category, inventory, featured } = await request.json()

    // Validate required fields
    if (!name || !description || price === undefined || !images || !category || inventory === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        imagesJson: JSON.stringify(images),
        category,
        inventory: Number(inventory),
        featured: Boolean(featured),
      },
    })

    return NextResponse.json({
      ...product,
      images: JSON.parse(product.imagesJson),
      imagesJson: undefined,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

