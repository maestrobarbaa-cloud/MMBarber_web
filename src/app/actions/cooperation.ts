"use server";

import { prisma } from "@/lib/prisma";

export async function submitCooperationAction(data: { name: string, email: string, phone: string, field: string, message: string }) {
  if (!data.name || !data.email || !data.field || !data.message) {
    return { success: false, error: "Všechna povinná pole musí být vyplněna." };
  }
  
  try {
    await prisma.cooperationRequest.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        field: data.field.trim(),
        message: data.message.trim(),
        status: "NEW"
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting cooperation request:", error);
    return { success: false, error: "Došlo k chybě při odesílání žádosti." };
  }
}

export async function getCooperationAdminAction() {
  try {
    const requests = await prisma.cooperationRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching cooperation requests:", error);
    return { success: false, error: "Failed to fetch" };
  }
}

export async function updateCooperationStatusAction(id: string, status: string) {
  try {
    await prisma.cooperationRequest.update({
      where: { id },
      data: { status }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating cooperation status:", error);
    return { success: false, error: "Failed to update" };
  }
}
