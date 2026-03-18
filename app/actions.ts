"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addApplication(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;
  const dateApplied = formData.get("dateApplied") as string;

  await prisma.application.create({
    data: {
      company,
      role,
      status: status || "Applied",
      notes,
      dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
      userId: session.user.id,
    },
  });

  revalidatePath("/");
}

export async function deleteApplication(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.application.delete({
    where: {
      id,
      userId: session.user.id, // Security measure
    },
  });

  revalidatePath("/");
}

export async function updateApplicationStatus(id: string, newStatus: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.application.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      status: newStatus,
    },
  });

  revalidatePath("/");
}
