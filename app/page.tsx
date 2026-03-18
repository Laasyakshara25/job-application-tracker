import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { prisma } from "../lib/prisma";
import DashboardClient from "../components/DashboardClient";
import LoginHero from "../components/LoginHero";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <LoginHero />;
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return <DashboardClient applications={applications} user={session.user} />;
}
