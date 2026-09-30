"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

async function processImage(imageUrl?: string) {
  if (!imageUrl || !imageUrl.startsWith('data:image')) {
    return imageUrl;
  }
  
  try {
    const base64Data = imageUrl.split(';base64,').pop();
    if (!base64Data) return imageUrl;
    
    // Create unique filename
    const ext = imageUrl.split(';')[0].split('/')[1] || 'jpg';
    const filename = `product-${Date.now()}-${Math.round(Math.random() * 1000)}.${ext}`;
    
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    
    // Ensure dir exists
    try {
      mkdirSync(uploadDir, { recursive: true });
    } catch(e) {}
    
    const filePath = join(uploadDir, filename);
    writeFileSync(filePath, base64Data, { encoding: 'base64' });
    
    return `/uploads/products/${filename}`;
  } catch (error) {
    console.error("Error saving image:", error);
    return imageUrl; // fallback to original
  }
}

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      reviews: {
        orderBy: { createdAt: 'desc' }
      },
      bids: {
        orderBy: { amount: 'desc' }
      }
    }
  })
}

export async function getCategories() {
  return await prisma.productCategory.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function createCategory(name: string) {
  const category = await prisma.productCategory.create({
    data: { name }
  })
  revalidatePath('/produkty')
  revalidatePath('/admin/produkty')
  return category
}

export async function deleteCategory(id: string) {
  await prisma.productCategory.delete({
    where: { id }
  })
  revalidatePath('/produkty')
  revalidatePath('/admin/produkty')
}

export async function createProduct(data: {
  name: string
  description?: string
  usage?: string; brand?: string
  price?: number
  discountPrice?: number
  stock?: number
  rating?: number
  imageUrl?: string; categoryId?: string | null; isAuction?: boolean; auctionEndsAt?: Date | null;
}) {
  const processedImageUrl = await processImage(data.imageUrl);

  await prisma.product.create({
    data: {
      ...data,
      imageUrl: processedImageUrl
    }
  })
  revalidatePath('/produkty')
  revalidatePath('/admin/produkty')
}

export async function updateProduct(id: string, data: {
  name?: string
  description?: string
  usage?: string; brand?: string
  price?: number
  discountPrice?: number
  stock?: number
  rating?: number
  imageUrl?: string; categoryId?: string | null; isAuction?: boolean; auctionEndsAt?: Date | null;
}) {
  const processedImageUrl = await processImage(data.imageUrl);

  await prisma.product.update({
    where: { id },
    data: {
      ...data,
      imageUrl: processedImageUrl
    }
  })
  revalidatePath('/produkty')
  revalidatePath('/admin/produkty')
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  })
  revalidatePath('/produkty')
  revalidatePath('/admin/produkty')
}

export async function addReview(productId: string, data: {
  author: string
  rating: number
  comment: string
}) {
  await prisma.productReview.create({
    data: {
      productId,
      author: data.author,
      rating: data.rating,
      comment: data.comment
    }
  })
  revalidatePath('/produkty')
}

export async function deleteReview(reviewId: string) {
  await prisma.productReview.delete({
    where: { id: reviewId }
  })
  revalidatePath('/produkty')
}

export async function createReservation(productId: string, customerName: string, pickupDateTime: Date) {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } })
    if (!product || product.stock <= 0) {
      throw new Error("Produkt jiĹľ nenĂ­ skladem")
    }

    await tx.product.update({
      where: { id: productId },
      data: { stock: product.stock - 1 }
    })

    const reservation = await tx.productReservation.create({
      data: {
        productId,
        customerName,
        pickupDateTime
      }
    })
    
    return reservation
  })
}

export async function getReservations() {
  return await prisma.productReservation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: true
    }
  })
}

export async function updateReservationStatus(id: string, status: string) {
  const reservation = await prisma.productReservation.findUnique({ where: { id } })
  if (!reservation) return

  await prisma.productReservation.update({
    where: { id },
    data: { status }
  })

  // If cancelled, return stock
  if (status === "CANCELLED" && reservation.status !== "CANCELLED") {
    await prisma.product.update({
      where: { id: reservation.productId },
      data: { stock: { increment: 1 } }
    })
  }

  revalidatePath('/admin/produkty')
  revalidatePath('/produkty')
}

export async function createBid(productId: string, bidderName: string, amount: number, pickupDateTime: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isAuction) {
    throw new Error('Tento produkt není v aukci.');
  }
  if (product.auctionEndsAt && product.auctionEndsAt < new Date()) {
    throw new Error('Tato aukce již skončila.');
  }
  await prisma.auctionBid.create({
    data: {
      productId,
      bidderName,
      amount,
      pickupDateTime: new Date(pickupDateTime)
    }
  });
  revalidatePath('/produkty');
  revalidatePath('/admin/produkty');
}

export async function getAuctionBids() {
  return await prisma.auctionBid.findMany({
    orderBy: [
      { amount: 'desc' },
      { createdAt: 'asc' }
    ],
    include: {
      product: true
    }
  });
}
