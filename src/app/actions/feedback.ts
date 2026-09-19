"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDb, saveDb } from "@/lib/jsonDb";
import crypto from "crypto";

export async function submitFeedbackAction(data: { type: string, message: string }) {
  const session = await getServerSession(authOptions);
  
  if (!data.message || data.message.trim() === "") {
    return { success: false, error: "Zpráva nemůže být prázdná." };
  }
  
  if (!['IDEA', 'BUG'].includes(data.type)) {
    return { success: false, error: "Neplatný typ zprávy." };
  }

  if (data.type === 'IDEA') {
    return { success: false, error: "Nápady se zpracovávají přes API /api/zlepseni." };
  }

  try {
    await prisma.userFeedback.create({
      data: {
        type: data.type,
        message: data.message.trim(),
        userId: session?.user?.id || null,
        status: "NEW"
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, error: "Došlo k chybě při odesílání." };
  }
}

export async function getFeedbackAdminAction() {
  try {
    const feedback = await prisma.userFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
    return { success: true, data: feedback };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return { success: false, error: "Failed to fetch" };
  }
}

export async function updateFeedbackStatusAction(id: string, status: string) {
  try {
    await prisma.userFeedback.update({
      where: { id },
      data: { status }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating feedback status:", error);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteFeedbackAction(id: string) {
  try {
    await prisma.userFeedback.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return { success: false, error: "Failed to delete" };
  }
}
