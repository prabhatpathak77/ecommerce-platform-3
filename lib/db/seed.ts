import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  console.log("Created admin user:", admin.email)

  // Create regular user
  const userPassword = await hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
    },
  })

  console.log("Created regular user:", user.email)

  // Create sample products
  const products = [
    {
      name: "Pearl Drop Earrings",
      description:
        "Elegant pearl drop earrings with sterling silver hooks. Perfect for both casual and formal occasions. These freshwater pearls have a beautiful luster and are hand-selected for quality and matching size.",
      price: 49.99,
      imagesJson: JSON.stringify(["/images/products/earrings-1.jpg", "/images/products/earrings-1-alt.jpg"]),
      category: "Earrings",
      inventory: 25,
      featured: true,
    },
    {
      name: "Gold Chain Necklace",
      description:
        "Delicate 14k gold-plated chain necklace with a small pendant. Adds a touch of elegance to any outfit. The chain is 18 inches long with a 2-inch extender for adjustable length.",
      price: 79.99,
      imagesJson: JSON.stringify(["/images/products/necklace-1.jpg", "/images/products/necklace-1-alt.jpg"]),
      category: "Necklaces",
      inventory: 15,
      featured: true,
    },
    {
      name: "Silver Bangle Bracelet",
      description:
        "Minimalist sterling silver bangle bracelet that complements any style. Adjustable size fits most wrists. The high-polish finish catches the light beautifully and resists tarnishing.",
      price: 39.99,
      imagesJson: JSON.stringify(["/images/products/bracelet-1.jpg"]),
      category: "Bracelets",
      inventory: 30,
      featured: false,
    },
    {
      name: "Leather Handbag",
      description:
        "Premium genuine leather handbag with multiple compartments. Spacious and stylish for everyday use. Features a secure zip closure, interior pockets, and an adjustable shoulder strap.",
      price: 129.99,
      imagesJson: JSON.stringify(["/images/products/handbag-1.jpg", "/images/products/handbag-1-alt.jpg"]),
      category: "Bags",
      inventory: 10,
      featured: true,
    },
    {
      name: "Silk Scarf",
      description:
        'Luxurious 100% silk scarf with a vibrant pattern. Versatile accessory for all seasons. The generous 36" x 36" size allows for multiple styling options from neck ties to head wraps.',
      price: 59.99,
      imagesJson: JSON.stringify(["/images/products/scarf-1.jpg"]),
      category: "Scarves",
      inventory: 20,
      featured: false,
    },
    {
      name: "Statement Ring",
      description:
        "Bold statement ring with a unique design. A conversation starter for any occasion. The adjustable band fits sizes 6-9, and the centerpiece features a stunning semi-precious stone.",
      price: 45.99,
      imagesJson: JSON.stringify(["/images/products/ring-1.jpg"]),
      category: "Rings",
      inventory: 18,
      featured: true,
    },
    {
      name: "Crystal Hair Clip",
      description:
        "Elegant crystal hair clip that adds sparkle to any hairstyle. Perfect for special events. The strong spring mechanism holds hair securely while the crystals catch the light beautifully.",
      price: 29.99,
      imagesJson: JSON.stringify(["/images/products/hairclip-1.jpg"]),
      category: "Hair Accessories",
      inventory: 22,
      featured: false,
    },
    {
      name: "Designer Sunglasses",
      description:
        "Stylish designer sunglasses with UV protection. Elevate your summer look with these fashionable frames that provide 100% UVA/UVB protection. Includes a protective case and cleaning cloth.",
      price: 89.99,
      imagesJson: JSON.stringify(["/images/products/sunglasses-1.jpg"]),
      category: "Eyewear",
      inventory: 12,
      featured: true,
    },
    {
      name: "Beaded Anklet",
      description:
        "Handcrafted beaded anklet with adjustable chain. Perfect for beach days and summer outfits. Features colorful glass beads and a durable stainless steel chain that won't tarnish in water.",
      price: 19.99,
      imagesJson: JSON.stringify(["/images/products/anklet-1.jpg"]),
      category: "Anklets",
      inventory: 35,
      featured: false,
    },
    {
      name: "Leather Watch",
      description:
        "Classic leather watch with a minimalist face. Timeless accessory for everyday wear. The genuine leather strap develops a beautiful patina over time, and the Japanese quartz movement ensures accurate timekeeping.",
      price: 99.99,
      imagesJson: JSON.stringify(["/images/products/watch-1.jpg"]),
      category: "Watches",
      inventory: 8,
      featured: true,
    },
    {
      name: "Embroidered Clutch",
      description:
        "Elegant embroidered clutch for special occasions. Includes a detachable chain strap. The intricate hand embroidery makes each piece slightly unique, and the satin lining protects your essentials.",
      price: 69.99,
      imagesJson: JSON.stringify(["/images/products/clutch-1.jpg"]),
      category: "Bags",
      inventory: 15,
      featured: false,
    },
    {
      name: "Gemstone Bracelet",
      description:
        "Colorful gemstone bracelet with healing properties. Adjustable size fits most wrists. Each stone is carefully selected for color and quality, and the elastic cord provides comfortable all-day wear.",
      price: 49.99,
      imagesJson: JSON.stringify(["/images/products/bracelet-2.jpg"]),
      category: "Bracelets",
      inventory: 20,
      featured: true,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log(`Created ${products.length} products`)
  console.log("Database has been seeded successfully!")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

